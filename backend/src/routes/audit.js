const express = require('express');
const { query, validationResult } = require('express-validator');
const AuditLog = require('../models/AuditLog');
const { auth, requirePermission } = require('../middleware/auth');

const router = express.Router();

// GET /api/audit
router.get('/', auth, requirePermission('AUDIT_VIEW'), async (req, res) => {
  try {
    const { workflowId, action, userId, startDate, endDate, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (workflowId) filter.workflowId = workflowId;
    if (action) {
      filter.action = { $in: Array.isArray(action) ? action : [action] };
    }
    if (userId) filter.userId = userId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const pageNum = Math.max(1, parseInt(page));
    const perPage = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * perPage;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(perPage),
      AuditLog.countDocuments(filter),
    ]);

    res.json({
      logs,
      pagination: {
        page: pageNum,
        limit: perPage,
        total,
        pages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/audit/stats
router.get('/stats', auth, requirePermission('AUDIT_VIEW'), async (req, res) => {
  try {
    const [totalLogs, actionCounts, recentLogs] = await Promise.all([
      AuditLog.countDocuments(),
      AuditLog.aggregate([
        { $group: { _id: '$action', count: { $sum: 1 } } },
      ]),
      AuditLog.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      totalLogs,
      actionCounts: actionCounts.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {}),
      recentLogs,
    });
  } catch (error) {
    console.error('Get audit stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
