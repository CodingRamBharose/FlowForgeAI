const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

const ROLE_PERMISSIONS = {
  ADMIN: [
    'WORKFLOW_CREATE', 'WORKFLOW_EDIT', 'WORKFLOW_DELETE',
    'WORKFLOW_PUBLISH', 'WORKFLOW_APPROVE', 'WORKFLOW_ROLLBACK',
    'WORKFLOW_VIEW', 'AUDIT_VIEW', 'USER_MANAGE',
  ],
  ENGINEER: ['WORKFLOW_CREATE', 'WORKFLOW_EDIT', 'WORKFLOW_VIEW'],
  REVIEWER: ['WORKFLOW_APPROVE', 'WORKFLOW_VIEW', 'AUDIT_VIEW'],
  VIEWER: ['WORKFLOW_VIEW'],
};

const requirePermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const userPerms = ROLE_PERMISSIONS[req.user.role] || [];
    const hasPermission = permissions.some((p) => userPerms.includes(p));
    if (!hasPermission) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = { auth, requireRole, requirePermission };
