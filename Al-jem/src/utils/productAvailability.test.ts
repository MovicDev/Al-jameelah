import assert from 'node:assert/strict';
import test from 'node:test';
import { isProductOutOfStock } from './productAvailability';

test('stockStatus is the customer-facing source of stock availability', () => {
  assert.equal(isProductOutOfStock({ stockStatus: 'out_of_stock', status: 'available' }), true);
  assert.equal(isProductOutOfStock({ stockStatus: 'in_stock', status: 'available' }), false);
});

test('legacy products with an out-of-stock status remain unavailable', () => {
  assert.equal(isProductOutOfStock({ status: 'out_of_stock' }), true);
});
