import { env } from '../config/env.js';
import { DEFAULT_ADMIN } from '../config/adminDefaults.js';
import { User } from '../models/User.js';

export const ensureDefaultAdmin = async ({
  UserModel = User,
  fullName = env.admin.fullName,
  email = env.admin.email,
  password = env.admin.password,
} = {}) => {
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await UserModel.hashPassword(password);
  const result = await UserModel.updateOne(
    { email: normalizedEmail },
    { $setOnInsert: { fullName, email: normalizedEmail, passwordHash, role: 'admin' } },
    { upsert: true },
  );

  return { email: normalizedEmail, created: result.upsertedCount > 0 };
};
