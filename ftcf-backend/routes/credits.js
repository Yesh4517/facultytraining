const express = require('express');
const CreditHistory = require('../models/CreditHistory');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/credits — faculty sees own history; admin/coordinator sees all
router.get('/', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'faculty') filter.faculty = req.user._id;
    if (req.query.facultyId) filter.faculty = req.query.facultyId;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.period) filter.period = req.query.period;

    const history = await CreditHistory.find(filter)
      .populate('faculty', 'name email department')
      .sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/credits — admin manually awards credits
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const entry = await CreditHistory.create({ ...req.body, source: 'Manual' });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
