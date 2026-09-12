import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveApiUrl } from './apiUrl';

test('a production build without an override uses the deployed backend', () => {
  assert.equal(resolveApiUrl(undefined, false), 'https://al-jameelah.onrender.com/api');
});

test('local development still defaults to the local backend', () => {
  assert.equal(resolveApiUrl(undefined, true), 'http://localhost:4000/api');
});

test('an environment override takes precedence and is normalized', () => {
  assert.equal(resolveApiUrl('https://api.example.com/api/', false), 'https://api.example.com/api');
});
