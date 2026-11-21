const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    faculty:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trainingTitle:  { type: String, required: true },
    provider:       { type: String, required: true },
    completionDate: { type: Date, required: true },
    credits:        { type: Number, required: true, min: 1 },
    category:       { type: String, enum: ['Technical', 'Teaching', 'Research', 'Leadership'], required: true },
    notes:          { type: String, default: '' },
    fileName:       { type: String, default: '' },
    filePath:       { type: String, default: '' },
    status:         { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
    verifiedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    verifiedDate:   { type: Date, default: null },
    rejectionReason:{ type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);
