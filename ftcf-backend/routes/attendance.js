const express = require('express');
const Attendance = require('../models/Attendance');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/attendance
router.get('/', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'faculty') filter.faculty = req.user._id;
    if (req.query.training) filter.training = req.query.training;
    if (req.query.sessionDate) filter.sessionDate = req.query.sessionDate;

    const records = await Attendance.find(filter)
      .populate('faculty', 'name email department')
      .populate('training', 'title')
      .sort({ sessionDate: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/attendance/bulk — coordinator saves attendance for a session
router.post('/bulk', protect, authorize('coordinator', 'admin'), async (req, res) => {
  try {
    const { trainingId, sessionDate, sessionLabel, records } = req.body;
    // records: [{ facultyId, attended }]

    const ops = records.map(({ facultyId, attended }) => ({
      updateOne: {
        filter: { faculty: facultyId, training: trainingId, sessionDate: new Date(sessionDate) },
        update: {
          $set: {
            faculty: facultyId,
            training: trainingId,
            sessionDate: new Date(sessionDate),
            sessionLabel: sessionLabel || '',
            attended,
            recordedBy: req.user._id,
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(ops);
    res.json({ message: `Attendance saved for ${records.length} records` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
