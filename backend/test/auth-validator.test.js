import assert from 'node:assert/strict';
import test from 'node:test';
import { registerSchema } from '../src/validators/authValidator.js';

const parseRegistration = (body) => registerSchema.safeParse({ body, params: {}, query: {} });

test('registration requires a valid customer phone number', () => {
  const withoutPhone = parseRegistration({
    fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'StrongPass1!',
  });
  const withPhone = parseRegistration({
    fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'StrongPass1!', phone: '+234 803 123 4567',
  });

  assert.equal(withoutPhone.success, false);
  assert.equal(withPhone.success, true);
});

test('short passwords return a specific ten-character message', () => {
  const result = parseRegistration({
    fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'Short1!', phone: '+234 803 123 4567',
  });

  assert.equal(result.success, false);
  assert.equal(result.error.issues[0].message, 'Password must contain at least 10 characters.');
});
