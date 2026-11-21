const express = require('express');
const User = require('../models/User');
const Training = require('../models/Training');
const Registration = require('../models/Registration');
const Certificate = require('../models/Certificate');
const CreditHistory = require('../models/CreditHistory');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/stats/system — admin overview stats
router.get('/system', protect, authorize('admin', 'coordinator'), async (req, res) => {
  try {
    const [totalFaculty, activeTrainings, pendingCerts, pendingRegs, creditSum] = await Promise.all([
      User.countDocuments({ role: 'faculty' }),
      Training.countDocuments({ status: { $in: ['Open', 'Full'] } }),
      Certificate.countDocuments({ status: 'Pending' }),
      Registration.countDocuments({ status: 'Pending' }),
      CreditHistory.aggregate([
        { $match: { status: 'Approved' } },
        { $group: { _id: null, total: { $sum: '$credits' } } },
      ]),
    ]);

    const faculty = await User.find({ role: 'faculty' }).select('totalCredits requiredCredits');
    const completed = faculty.filter((f) => f.totalCredits >= f.requiredCredits).length;
    const overallCompliance = faculty.length ? Math.round((completed / faculty.length) * 100) : 0;

    res.json({
      totalFaculty,
      activeTrainings,
      certificatesPending: pendingCerts,
      pendingRegistrations: pendingRegs,
      overallCompliance,
      creditsIssuedThisYear: creditSum[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/stats/departments — per-department breakdown
router.get('/departments', protect, authorize('admin', 'coordinator'), async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' }).select('department totalCredits requiredCredits');
    const deptMap = {};
    faculty.forEach((f) => {
      if (!deptMap[f.department]) deptMap[f.department] = { faculty: 0, totalCredits: 0, completed: 0 };
      deptMap[f.department].faculty++;
      deptMap[f.department].totalCredits += f.totalCredits;
      if (f.totalCredits >= f.requiredCredits) deptMap[f.department].completed++;
    });

    const result = Object.entries(deptMap).map(([dept, d]) => ({
      department: dept,
      faculty: d.faculty,
      avgCredits: d.faculty ? Math.round(d.totalCredits / d.faculty) : 0,
      compliance: d.faculty ? Math.round((d.completed / d.faculty) * 100) : 0,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/stats/monthly-trends — last 6 months
router.get('/monthly-trends', protect, async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trends = await CreditHistory.aggregate([
      { $match: { status: 'Approved', date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          credits: { $sum: '$credits' },
          activities: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = trends.map((t) => ({
      month: months[t._id.month - 1],
      credits: t.credits,
      trainings: t.activities,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/stats/faculty/:id — per-faculty stats
router.get('/faculty/:id', protect, async (req, res) => {
  try {
    const targetId = req.params.id === 'me' ? req.user._id : req.params.id;
    if (req.user.role === 'faculty' && targetId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorised' });

    const [user, regs, certs, creditHist] = await Promise.all([
      User.findById(targetId).select('-password'),
      Registration.find({ faculty: targetId }).populate('training', 'title category credits'),
      Certificate.find({ faculty: targetId }),
      CreditHistory.find({ faculty: targetId, status: 'Approved' }),
    ]);

    const approvedCredits = creditHist.reduce((s, c) => s + c.credits, 0);
    const pendingCredits = (await CreditHistory.find({ faculty: targetId, status: 'Pending' }))
      .reduce((s, c) => s + c.credits, 0);

    res.json({
      user,
      stats: {
        totalRegistrations: regs.length,
        approvedRegistrations: regs.filter((r) => r.status === 'Approved').length,
        completedTrainings: regs.filter((r) => r.status === 'Completed').length,
        pendingCertificates: certs.filter((c) => c.status === 'Pending').length,
        approvedCredits,
        pendingCredits,
        progressPercent: user ? Math.round((user.totalCredits / user.requiredCredits) * 100) : 0,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
