const express = require('express');
const Training = require('../models/Training');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/trainings
router.get('/', protect, async (req, res) => {
  try {
    const { category, mode, status, search } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (mode && mode !== 'All') filter.mode = mode;
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const trainings = await Training.find(filter)
      .populate('createdBy', 'name email')
      .sort({ startDate: 1 });
    res.json(trainings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/trainings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const training = await Training.findById(req.params.id).populate('createdBy', 'name email');
    if (!training) return res.status(404).json({ message: 'Training not found' });
    res.json(training);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/trainings — coordinator or admin
router.post('/', protect, authorize('coordinator', 'admin'), async (req, res) => {
  try {
    const training = await Training.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(training);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/trainings/:id
router.put('/:id', protect, authorize('coordinator', 'admin'), async (req, res) => {
  try {
    const training = await Training.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!training) return res.status(404).json({ message: 'Training not found' });
    res.json(training);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/trainings/:id
router.delete('/:id', protect, authorize('coordinator', 'admin'), async (req, res) => {
  try {
    await Training.findByIdAndDelete(req.params.id);
    res.json({ message: 'Training deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
