import assert from 'node:assert/strict';
import test from 'node:test';
import { updateProductSchema } from '../src/validators/productValidator.js';

test('a featured-only update does not inject stock or create defaults', () => {
  const result = updateProductSchema.safeParse({
    body: { featured: true },
    params: { id: '507f1f77bcf86cd799439011' },
    query: {},
  });

  assert.equal(result.success, true);
  assert.deepEqual(result.data.body, { featured: true });
});
