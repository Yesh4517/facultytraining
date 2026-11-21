const mongoose = require('mongoose');

const creditHistorySchema = new mongoose.Schema(
  {
    faculty:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    activity:  { type: String, required: true },
    type:      { type: String, enum: ['Certification', 'Training Programme', 'Workshop', 'Conference', 'Other'], default: 'Other' },
    category:  { type: String, enum: ['Technical', 'Teaching', 'Research', 'Leadership'], required: true },
    credits:   { type: Number, required: true },
    date:      { type: Date, default: Date.now },
    status:    { type: String, enum: ['Approved', 'Pending', 'Rejected'], default: 'Pending' },
    period:    { type: String, default: '' },
    source:    { type: String, enum: ['Certificate', 'Registration', 'Manual'], default: 'Manual' },
    sourceRef: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CreditHistory', creditHistorySchema);
