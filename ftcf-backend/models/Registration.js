const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    faculty:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    training:         { type: mongoose.Schema.Types.ObjectId, ref: 'Training', required: true },
    registrationDate: { type: Date, default: Date.now },
    status:           { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Completed'], default: 'Pending' },
    credits:          { type: Number, default: 0 },
    completionDate:   { type: Date, default: null },
    supervisorName:   { type: String, default: '' },
    justification:    { type: String, default: '' },
    reviewedBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewNote:       { type: String, default: '' },
  },
  { timestamps: true }
);

// Prevent duplicate registration for same faculty + training
registrationSchema.index({ faculty: 1, training: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
