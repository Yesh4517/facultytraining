const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    faculty:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    training:     { type: mongoose.Schema.Types.ObjectId, ref: 'Training', required: true },
    sessionDate:  { type: Date, required: true },
    sessionLabel: { type: String, default: '' },
    attended:     { type: Boolean, default: false },
    recordedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

attendanceSchema.index({ faculty: 1, training: 1, sessionDate: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
