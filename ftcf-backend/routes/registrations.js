const express = require('express');
const Registration = require('../models/Registration');
const Training = require('../models/Training');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/registrations — faculty sees their own; coordinator/admin sees all
router.get('/', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'faculty') filter.faculty = req.user._id;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.training) filter.training = req.query.training;

    const regs = await Registration.find(filter)
      .populate('faculty', 'name email department designation avatar')
      .populate('training', 'title category provider credits mode startDate endDate')
      .sort({ registrationDate: -1 });
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/registrations — faculty submits a registration
router.post('/', protect, authorize('faculty'), async (req, res) => {
  try {
    const training = await Training.findById(req.body.training);
    if (!training) return res.status(404).json({ message: 'Training not found' });
    if (training.status === 'Full') return res.status(400).json({ message: 'Training is full' });

    const existing = await Registration.findOne({ faculty: req.user._id, training: req.body.training });
    if (existing) return res.status(400).json({ message: 'Already registered for this training' });

    const reg = await Registration.create({
      faculty: req.user._id,
      training: req.body.training,
      credits: training.credits,
      supervisorName: req.body.supervisorName || '',
      justification: req.body.justification || '',
    });

    // Bump enrolled count
    training.enrolled += 1;
    if (training.enrolled >= training.seats) training.status = 'Full';
    await training.save();

    await reg.populate('training', 'title category provider credits mode');
    res.status(201).json(reg);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Already registered for this training' });
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/registrations/:id/status — coordinator/admin approves or rejects
router.put('/:id/status', protect, authorize('coordinator', 'admin'), async (req, res) => {
  try {
    const { status, reviewNote } = req.body;
    if (!['Approved', 'Rejected', 'Completed'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const reg = await Registration.findByIdAndUpdate(
      req.params.id,
      { status, reviewNote: reviewNote || '', reviewedBy: req.user._id },
      { new: true }
    )
      .populate('faculty', 'name email department')
      .populate('training', 'title credits');

    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    res.json(reg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/registrations/:id — faculty can withdraw their own pending registration
router.delete('/:id', protect, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    if (req.user.role === 'faculty' && reg.faculty.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorised' });
    if (reg.status !== 'Pending' && req.user.role === 'faculty')
      return res.status(400).json({ message: 'Only pending registrations can be withdrawn' });

    // Decrement enrolled
    await Training.findByIdAndUpdate(reg.training, { $inc: { enrolled: -1 } });
    await reg.deleteOne();
    res.json({ message: 'Registration withdrawn' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
