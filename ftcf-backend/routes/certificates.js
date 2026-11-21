const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const CreditHistory = require('../models/CreditHistory');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'certificates');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|jpg|jpeg|png/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only PDF, JPG, and PNG files are allowed'));
  },
});

// GET /api/certificates — faculty sees own; coordinator/admin sees all
router.get('/', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'faculty') filter.faculty = req.user._id;
    if (req.query.status) filter.status = req.query.status;

    const certs = await Certificate.find(filter)
      .populate('faculty', 'name email department designation')
      .populate('verifiedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/certificates — faculty uploads a certificate
router.post('/', protect, authorize('faculty'), upload.single('file'), async (req, res) => {
  try {
    const certData = {
      faculty: req.user._id,
      trainingTitle: req.body.trainingTitle,
      provider: req.body.provider,
      completionDate: req.body.completionDate,
      credits: Number(req.body.credits),
      category: req.body.category,
      notes: req.body.notes || '',
    };

    if (req.file) {
      certData.fileName = req.file.originalname;
      certData.filePath = `/uploads/certificates/${req.file.filename}`;
    }

    const cert = await Certificate.create(certData);
    await cert.populate('faculty', 'name email department');
    res.status(201).json(cert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/certificates/:id/verify — coordinator/admin verifies or rejects
router.put('/:id/verify', protect, authorize('coordinator', 'admin'), async (req, res) => {
  try {
    const { action, rejectionReason } = req.body;
    if (!['approve', 'reject'].includes(action))
      return res.status(400).json({ message: 'Action must be approve or reject' });

    const cert = await Certificate.findById(req.params.id).populate('faculty', 'name email');
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });

    if (action === 'approve') {
      cert.status = 'Verified';
      cert.verifiedBy = req.user._id;
      cert.verifiedDate = new Date();

      // Award credits to faculty
      await User.findByIdAndUpdate(cert.faculty._id, { $inc: { totalCredits: cert.credits } });

      // Log credit history
      await CreditHistory.create({
        faculty: cert.faculty._id,
        activity: cert.trainingTitle,
        type: 'Certification',
        category: cert.category,
        credits: cert.credits,
        date: cert.completionDate,
        status: 'Approved',
        period: new Date(cert.completionDate).getFullYear().toString(),
        source: 'Certificate',
        sourceRef: cert._id,
      });
    } else {
      cert.status = 'Rejected';
      cert.rejectionReason = rejectionReason || 'No reason provided';
      cert.verifiedBy = req.user._id;
      cert.verifiedDate = new Date();
    }

    await cert.save();
    await cert.populate('verifiedBy', 'name');
    res.json(cert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
