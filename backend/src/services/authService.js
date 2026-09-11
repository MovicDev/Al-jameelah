import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { issueSession } from './tokenService.js';
import { sendPasswordReset } from './emailService.js';

export const register = async ({ fullName, email, password, phone }) => {
  if (await User.exists({ email })) throw new AppError(409, 'email_exists', 'An account already exists for this email.');
  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ fullName, email, passwordHash, phone });
  return { user, session: issueSession(user) };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await user.verifyPassword(password))) {
    throw new AppError(401, 'invalid_credentials', 'The email or password is incorrect.');
  }
  return { user, session: issueSession(user) };
};

export const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email }).select('+passwordResetTokenHash +passwordResetExpiresAt');
  if (!user) return;
  const token = crypto.randomBytes(32).toString('hex');
  user.passwordResetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
  user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();
  const resetUrl = new URL(env.appUrl);
  resetUrl.searchParams.set('reset_token', token);
  await sendPasswordReset(user.email, resetUrl.toString());
};

export const resetPassword = async ({ token, password }) => {
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetTokenHash: hash,
    passwordResetExpiresAt: { $gt: new Date() },
  }).select('+passwordResetTokenHash +passwordResetExpiresAt');
  if (!user) throw new AppError(400, 'invalid_reset_token', 'This password-reset link is invalid or expired.');
  user.passwordHash = await User.hashPassword(password);
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpiresAt = undefined;
  await user.save();
};

