const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, requirePermission } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - List all users (admin only)
router.get('/', auth, requirePermission('USER_MANAGE'), async (req, res) => {
  try {
    const { search, role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json(users.map((u) => u.toJSON()));
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/users/:id/role - Update user role (admin only)
router.patch(
  '/:id/role',
  auth,
  requirePermission('USER_MANAGE'),
  [
    body('role')
      .isIn(['ADMIN', 'ENGINEER', 'REVIEWER', 'VIEWER'])
      .withMessage('Invalid role'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Prevent admin from changing their own role
      if (user._id.toString() === req.userId) {
        return res.status(400).json({ message: 'Cannot change your own role' });
      }

      user.role = req.body.role;
      await user.save();

      res.json(user.toJSON());
    } catch (error) {
      console.error('Update role error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', auth, requirePermission('USER_MANAGE'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
