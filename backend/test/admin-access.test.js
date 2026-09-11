import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_ADMIN } from '../src/config/adminDefaults.js';
import { User } from '../src/models/User.js';
import { ensureDefaultAdmin } from '../src/services/adminBootstrapService.js';
import { changePassword } from '../src/services/profileService.js';

test('a fresh installation creates the documented default administrator once', async () => {
  const calls = [];
  const UserModel = {
    hashPassword: async (password) => `hashed:${password}`,
    updateOne: async (...args) => { calls.push(args); return { upsertedCount: 1 }; },
  };

  const result = await ensureDefaultAdmin({ UserModel, ...DEFAULT_ADMIN });

  assert.deepEqual(result, { email: 'admin@aljameelah.com', created: true });
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0], [
    { email: 'admin@aljameelah.com' },
    { $setOnInsert: {
      fullName: 'Store Administrator',
      email: 'admin@aljameelah.com',
      passwordHash: 'hashed:Admin@12345',
      role: 'admin',
    } },
    { upsert: true },
  ]);
});

test('an authenticated administrator can replace the default password', async () => {
  const user = new User({
    fullName: 'Store Administrator',
    email: 'admin@aljameelah.com',
    passwordHash: await User.hashPassword('Admin@12345'),
    role: 'admin',
  });
  let saves = 0;
  user.save = async () => { saves += 1; return user; };

  await changePassword(user, {
    currentPassword: 'Admin@12345',
    newPassword: 'PrivateAdmin@678',
  });

  assert.equal(saves, 1);
  assert.equal(await user.verifyPassword('Admin@12345'), false);
  assert.equal(await user.verifyPassword('PrivateAdmin@678'), true);
});

test('changing a password rejects an incorrect current password', async () => {
  const user = new User({
    fullName: 'Store Administrator',
    email: 'admin@aljameelah.com',
    passwordHash: await User.hashPassword('Admin@12345'),
    role: 'admin',
  });
  user.save = async () => user;

  await assert.rejects(
    changePassword(user, { currentPassword: 'Wrong@12345', newPassword: 'PrivateAdmin@678' }),
    (error) => error.status === 401 && error.code === 'invalid_current_password',
  );
});
