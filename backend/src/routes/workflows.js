const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Workflow = require('../models/Workflow');
const AuditLog = require('../models/AuditLog');
const { auth, requirePermission } = require('../middleware/auth');

const router = express.Router();

// GET /api/workflows
router.get('/', auth, requirePermission('WORKFLOW_VIEW'), async (req, res) => {
  try {
    const { status, search, tags, sortField, sortDir } = req.query;

    const filter = {};
    if (status) {
      filter.status = { $in: Array.isArray(status) ? status : [status] };
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }

    const sort = {};
    if (sortField) {
      sort[sortField] = sortDir === 'desc' ? -1 : 1;
    } else {
      sort.updatedAt = -1;
    }

    const workflows = await Workflow.find(filter).sort(sort);
    res.json(workflows);
  } catch (error) {
    console.error('Get workflows error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/workflows/:id
router.get('/:id', auth, requirePermission('WORKFLOW_VIEW'), async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }
    res.json(workflow);
  } catch (error) {
    console.error('Get workflow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/workflows
router.post(
  '/',
  auth,
  requirePermission('WORKFLOW_CREATE'),
  [
    body('name').notEmpty().trim().withMessage('Workflow name is required'),
    body('description').optional().trim(),
    body('steps').optional().isArray(),
    body('tags').optional().isArray(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { name, description, steps, tags } = req.body;

      const workflow = new Workflow({
        name,
        description: description || '',
        steps: steps || [],
        tags: tags || [],
        createdBy: req.user.name,
        updatedBy: req.user.name,
      });

      await workflow.save();

      // Create audit log
      await AuditLog.create({
        workflowId: workflow._id.toString(),
        workflowName: name,
        action: 'created',
        userId: req.userId,
        userName: req.user.name,
        details: `Created new workflow "${name}"`,
      });

      // Emit socket event
      const io = req.app.get('io');
      if (io) {
        io.emit('workflow-created', workflow.toJSON());
      }

      res.status(201).json(workflow);
    } catch (error) {
      console.error('Create workflow error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// PUT /api/workflows/:id
router.put(
  '/:id',
  auth,
  requirePermission('WORKFLOW_EDIT'),
  [
    body('name').optional().notEmpty().trim(),
    body('description').optional().trim(),
    body('steps').optional().isArray(),
    body('tags').optional().isArray(),
    body('status').optional().isIn(['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'PUBLISHED', 'ARCHIVED']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const workflow = await Workflow.findById(req.params.id);
      if (!workflow) {
        return res.status(404).json({ message: 'Workflow not found' });
      }

      const { name, description, steps, tags, status } = req.body;

      // Save current state as a version
      const versionEntry = {
        id: `v-${Date.now()}`,
        version: workflow.currentVersion,
        createdAt: new Date(),
        createdBy: req.user.name,
        changes: `Updated by ${req.user.name}`,
        steps: [...workflow.steps],
      };
      workflow.versions.push(versionEntry);
      workflow.currentVersion += 1;

      if (name !== undefined) workflow.name = name;
      if (description !== undefined) workflow.description = description;
      if (steps !== undefined) workflow.steps = steps;
      if (tags !== undefined) workflow.tags = tags;
      if (status !== undefined) workflow.status = status;
      workflow.updatedBy = req.user.name;

      await workflow.save();

      // Create audit log
      await AuditLog.create({
        workflowId: workflow._id.toString(),
        workflowName: workflow.name,
        action: 'updated',
        userId: req.userId,
        userName: req.user.name,
        details: `Updated workflow "${workflow.name}"`,
      });

      const io = req.app.get('io');
      if (io) {
        io.emit('workflow-updated', workflow.toJSON());
      }

      res.json(workflow);
    } catch (error) {
      console.error('Update workflow error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// DELETE /api/workflows/:id
router.delete('/:id', auth, requirePermission('WORKFLOW_DELETE'), async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    const workflowName = workflow.name;
    await Workflow.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      workflowId: req.params.id,
      workflowName,
      action: 'deleted',
      userId: req.userId,
      userName: req.user.name,
      details: `Deleted workflow "${workflowName}"`,
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('workflow-deleted', { id: req.params.id });
    }

    res.json({ message: 'Workflow deleted successfully' });
  } catch (error) {
    console.error('Delete workflow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/workflows/:id/publish
router.post('/:id/publish', auth, requirePermission('WORKFLOW_PUBLISH'), async (req, res) => {
  try {
    const { environment } = req.body;
    if (!environment || !['DEV', 'STAGING', 'PROD'].includes(environment)) {
      return res.status(400).json({ message: 'Valid environment is required (DEV, STAGING, PROD)' });
    }

    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    // Update or add environment deployment
    const existingEnvIdx = workflow.environments.findIndex(
      (e) => e.environment === environment
    );

    const deployment = {
      environment,
      version: workflow.currentVersion,
      deployedAt: new Date(),
      deployedBy: req.user.name,
      status: 'active',
    };

    if (existingEnvIdx >= 0) {
      workflow.environments[existingEnvIdx] = deployment;
    } else {
      workflow.environments.push(deployment);
    }

    workflow.status = 'PUBLISHED';
    workflow.updatedBy = req.user.name;
    await workflow.save();

    await AuditLog.create({
      workflowId: workflow._id.toString(),
      workflowName: workflow.name,
      action: 'published',
      userId: req.userId,
      userName: req.user.name,
      details: `Published version ${workflow.currentVersion} to ${environment}`,
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('workflow-published', { workflow: workflow.toJSON(), environment });
    }

    res.json(workflow);
  } catch (error) {
    console.error('Publish workflow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/workflows/:id/approve
router.post('/:id/approve', auth, requirePermission('WORKFLOW_APPROVE'), async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    workflow.status = 'APPROVED';
    workflow.updatedBy = req.user.name;
    await workflow.save();

    await AuditLog.create({
      workflowId: workflow._id.toString(),
      workflowName: workflow.name,
      action: 'approved',
      userId: req.userId,
      userName: req.user.name,
      details: `Approved workflow "${workflow.name}"`,
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('workflow-approved', workflow.toJSON());
    }

    res.json(workflow);
  } catch (error) {
    console.error('Approve workflow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/workflows/:id/rollback
router.post('/:id/rollback', auth, requirePermission('WORKFLOW_ROLLBACK'), async (req, res) => {
  try {
    const { version } = req.body;
    if (!version) {
      return res.status(400).json({ message: 'Version number is required' });
    }

    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    const targetVersion = workflow.versions.find((v) => v.version === version);
    if (!targetVersion) {
      return res.status(404).json({ message: 'Version not found' });
    }

    // Save current as a version before rollback
    workflow.versions.push({
      id: `v-${Date.now()}`,
      version: workflow.currentVersion,
      createdAt: new Date(),
      createdBy: req.user.name,
      changes: `Pre-rollback snapshot`,
      steps: [...workflow.steps],
    });

    workflow.steps = targetVersion.steps;
    workflow.currentVersion += 1;
    workflow.updatedBy = req.user.name;
    await workflow.save();

    await AuditLog.create({
      workflowId: workflow._id.toString(),
      workflowName: workflow.name,
      action: 'rollback',
      userId: req.userId,
      userName: req.user.name,
      details: `Rolled back to version ${version}`,
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('workflow-rollback', workflow.toJSON());
    }

    res.json(workflow);
  } catch (error) {
    console.error('Rollback workflow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
