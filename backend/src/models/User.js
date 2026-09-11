import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const avatarSchema = new mongoose.Schema({
  url: { type: String, default: null },
  publicId: { type: String, default: null },
}, { _id: false });

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  phone: { type: String, trim: true, maxlength: 30, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
  avatar: { type: avatarSchema, default: () => ({ url: null, publicId: null }) },
  passwordResetTokenHash: { type: String, select: false },
  passwordResetExpiresAt: { type: Date, select: false },
}, { timestamps: true });

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = (password) => bcrypt.hash(password, 12);

export const User = mongoose.model('User', userSchema);

