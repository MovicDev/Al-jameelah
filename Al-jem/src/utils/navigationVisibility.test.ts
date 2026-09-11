import assert from 'node:assert/strict';
import test from 'node:test';
import { shouldShowCart } from './navigationVisibility';

test('the cart is customer-only and appears only when it contains items', () => {
  assert.equal(shouldShowCart({ isAdmin: true, cartItemCount: 3 }), false);
  assert.equal(shouldShowCart({ isAdmin: false, isRolePending: true, cartItemCount: 3 }), false);
  assert.equal(shouldShowCart({ isAdmin: false, cartItemCount: 0 }), false);
  assert.equal(shouldShowCart({ isAdmin: false, cartItemCount: 2 }), true);
});
