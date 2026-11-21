const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema(
  {
    title:                { type: String, required: true, trim: true },
    category:             { type: String, enum: ['Technical', 'Teaching', 'Research', 'Leadership'], required: true },
    provider:             { type: String, required: true },
    credits:              { type: Number, required: true, min: 1 },
    duration:             { type: String, default: '' },
    mode:                 { type: String, enum: ['Online', 'On-Campus', 'Hybrid'], required: true },
    startDate:            { type: Date, required: true },
    endDate:              { type: Date, required: true },
    registrationDeadline: { type: Date },
    seats:                { type: Number, required: true },
    enrolled:             { type: Number, default: 0 },
    status:               { type: String, enum: ['Open', 'Full', 'Draft', 'Completed', 'Cancelled'], default: 'Open' },
    description:          { type: String, default: '' },
    venue:                { type: String, default: '' },
    targetAudience:       { type: String, default: '' },
    image:                { type: String, default: '' },
    createdBy:            { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    brochure:             { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Training', trainingSchema);
