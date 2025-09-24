const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course');
const Service = require('../models/Service');

// Admin-only guard
function adminOnly(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden: Admins only' });
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// ----- Users -----
// GET /api/admin/users
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const role = req.query.role || '';
    const status = req.query.status || '';

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) filter.role = role;
    if (status) filter.status = status;

    const [users, totalUsers] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return res.json({ users, totalUsers, page, limit });
  } catch (err) {
    console.error('Admin users list error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/users
router.post('/users', auth, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role = 'refugee', status = 'active' } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already in use' });

    const user = new User({ name, email, password, role, status, isEmailVerified: true });
    await user.save();
    const safe = user.toObject();
    delete safe.password;
    return res.status(201).json(safe);
  } catch (err) {
    console.error('Admin create user error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/admin/users/:id
router.put('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    const updates = { ...req.body };
    // Prevent email collision
    if (updates.email) {
      const emailInUse = await User.findOne({ email: updates.email, _id: { $ne: req.params.id } });
      if (emailInUse) return res.status(400).json({ error: 'Email already in use' });
    }
    // Never allow direct password replacement here unless explicitly provided
    if (!updates.password) delete updates.password;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) {
    console.error('Admin update user error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/admin/users/:id/status
router.put('/users/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body; // expected: 'active' | 'blocked' | 'pending'
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) {
    console.error('Admin update user status error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ success: true });
  } catch (err) {
    console.error('Admin delete user error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/users/invite (basic stub)
router.post('/users/invite', auth, adminOnly, async (req, res) => {
  try {
    const { email, role = 'volunteer' } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    // In a full implementation, send an email with an invite link.
    return res.json({ success: true, message: `Invitation queued for ${email}`, role });
  } catch (err) {
    console.error('Admin invite user error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ----- Courses (Programs) -----
// GET /api/admin/courses
router.get('/courses', auth, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = search ? { title: { $regex: search, $options: 'i' } } : {};

    const [items, total] = await Promise.all([
      Course.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Course.countDocuments(filter),
    ]);

    return res.json({ courses: items, total, page, limit });
  } catch (err) {
    console.error('Admin list courses error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/courses
router.post('/courses', auth, adminOnly, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    return res.status(201).json(course);
  } catch (err) {
    console.error('Admin create course error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/admin/courses/:id
router.put('/courses/:id', auth, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    return res.json(course);
  } catch (err) {
    console.error('Admin update course error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/courses/:id
router.delete('/courses/:id', auth, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    return res.json({ success: true });
  } catch (err) {
    console.error('Admin delete course error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ----- Services (Programs alternative) -----
router.get('/services', auth, adminOnly, async (req, res) => {
  try {
    const items = await Service.find({}).sort({ createdAt: -1 });
    return res.json({ services: items, total: items.length });
  } catch (err) {
    console.error('Admin list services error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/services', auth, adminOnly, async (req, res) => {
  try {
    const item = new Service(req.body);
    await item.save();
    return res.status(201).json(item);
  } catch (err) {
    console.error('Admin create service error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.put('/services/:id', auth, adminOnly, async (req, res) => {
  try {
    const item = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Service not found' });
    return res.json(item);
  } catch (err) {
    console.error('Admin update service error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/services/:id', auth, adminOnly, async (req, res) => {
  try {
    const item = await Service.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Service not found' });
    return res.json({ success: true });
  } catch (err) {
    console.error('Admin delete service error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
