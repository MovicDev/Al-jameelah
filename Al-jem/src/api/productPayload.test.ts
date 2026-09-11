import assert from 'node:assert/strict';
import test from 'node:test';
import { getDiscountPriceError, toCreateProductPayload } from './productPayload';

test('a product create request contains only fields shown in the editor', () => {
  const payload = toCreateProductPayload({
    name: 'First Product',
    slug: 'first-product',
    category: 'natural-hair',
    price: 78,
    discountPrice: 52,
    size: '100ml',
    stockStatus: 'in_stock',
    shortDescription: 'Aspernatur accusamus',
    description: 'Illum dolor aut dig',
    images: ['https://example.com/product.jpg'],
    stock: 50,
    status: 'available',
    featured: true,
    benefits: ['Moisturizes dry hair'],
    ingredients: ['Hidden default'],
    howToUse: 'Apply to damp hair twice weekly.',
    hairTypes: ['4C'],
    rating: 5,
    reviewCount: 12,
    sku: 'AJ-HIDDEN',
  });

  assert.deepEqual(payload, {
    name: 'First Product',
    category: 'natural-hair',
    price: 78,
    discountPrice: 52,
    size: '100ml',
    stockStatus: 'in_stock',
    shortDescription: 'Aspernatur accusamus',
    description: 'Illum dolor aut dig',
    images: ['https://example.com/product.jpg'],
    benefits: ['Moisturizes dry hair'],
    howToUse: 'Apply to damp hair twice weekly.',
    hairTypes: ['4C'],
  });
});

test('a discount above the regular price is caught before submitting', () => {
  assert.equal(
    getDiscountPriceError(52, 78),
    'Discount price cannot be higher than the regular price.',
  );
  assert.equal(getDiscountPriceError(78, 52), null);
  assert.equal(getDiscountPriceError(52, undefined), null);
});
