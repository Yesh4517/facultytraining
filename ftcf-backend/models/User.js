const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true, trim: true },
    email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:       { type: String, required: true },
    role:           { type: String, enum: ['faculty', 'coordinator', 'admin'], default: 'faculty' },
    department:     { type: String, default: '' },
    designation:    { type: String, default: '' },
    avatar:         { type: String, default: '' },
    totalCredits:   { type: Number, default: 0 },
    requiredCredits:{ type: Number, default: 40 },
    phone:          { type: String, default: '' },
    bio:            { type: String, default: '' },
    isActive:       { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Strip password from JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
