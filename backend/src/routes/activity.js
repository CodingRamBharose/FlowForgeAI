const express = require('express');
const Activity = require('../models/Activity');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/activity
router.get('/', auth, async (req, res) => {
  try {
    const { type, status, workflowId, environment, limit = 50 } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (workflowId) filter.workflowId = workflowId;
    if (environment) filter.environment = environment;

    const perPage = Math.min(100, Math.max(1, parseInt(limit)));

    const activities = await Activity.find(filter)
      .sort({ createdAt: -1 })
      .limit(perPage);

    res.json(activities);
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/activity
router.post('/', auth, async (req, res) => {
  try {
    const { type, title, description, status, progress, workflowId, workflowName, environment, errorMessage } = req.body;

    const activity = new Activity({
      type,
      title,
      description,
      status: status || 'PENDING',
      progress: progress || 0,
      workflowId,
      workflowName,
      environment,
      userId: req.userId,
      errorMessage,
    });

    await activity.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('new-activity', activity.toJSON());
    }

    res.status(201).json(activity);
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
