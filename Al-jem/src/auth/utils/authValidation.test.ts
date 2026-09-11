import assert from 'node:assert/strict';
import test from 'node:test';
import { validateEmail, validateFullName, validatePassword, validatePhone } from './authValidation.js';

test('validates registration identity fields', () => {
  assert.equal(validateEmail('user@example.com'), null);
  assert.equal(validateEmail('not-an-email'), 'Enter a valid email address.');
  assert.equal(validateFullName('Ada Lovelace'), null);
  assert.equal(validateFullName('A'), 'Full name must be at least 2 characters.');
  assert.equal(validatePhone('+234 803 123 4567'), null);
  assert.equal(validatePhone('123'), 'Enter a valid phone number with at least 10 digits.');
});

test('enforces all strong password requirements', () => {
  assert.equal(validatePassword('StrongPass1!'), null);
  assert.equal(validatePassword('short'), 'Password must contain at least 10 characters (currently 5).');
  assert.notEqual(validatePassword('alllowercase1!'), null);
  assert.notEqual(validatePassword('ALLUPPERCASE1!'), null);
  assert.notEqual(validatePassword('NoNumbersHere!'), null);
  assert.notEqual(validatePassword('NoSpecial123'), null);
});
