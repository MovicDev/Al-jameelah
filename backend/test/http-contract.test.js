import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

test('health endpoint reports a ready HTTP process', async () => {
  const response = await request(app).get('/health');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { success: true, status: 'ok' });
});

test('registration rejects weak or malformed identity data before persistence', async () => {
  const response = await request(app).post('/api/auth/register').send({
    fullName: 'A', email: 'wrong', password: 'weak',
  });
  assert.equal(response.status, 422);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'validation_error');
});

test('protected and admin endpoints reject missing bearer tokens', async () => {
  const [profile, createProduct, admin] = await Promise.all([
    request(app).get('/api/profile'),
    request(app).post('/api/products').send({}),
    request(app).get('/api/admin/access'),
  ]);
  assert.equal(profile.status, 401);
  assert.equal(createProduct.status, 401);
  assert.equal(admin.status, 401);
  assert.equal(admin.body.error.code, 'missing_token');
});

test('unknown routes use the consistent not-found envelope', async () => {
  const response = await request(app).get('/api/does-not-exist');
  assert.equal(response.status, 404);
  assert.equal(response.body.error.code, 'not_found');
});

test('public business endpoints reject malformed resource and checkout data before database access', async () => {
  const [product, order] = await Promise.all([
    request(app).get('/api/products/not-an-object-id'),
    request(app).post('/api/orders').send({ customerInfo: {}, items: [] }),
  ]);
  assert.equal(product.status, 422);
  assert.equal(product.body.error.code, 'validation_error');
  assert.equal(order.status, 422);
  assert.equal(order.body.error.code, 'validation_error');
});

test('an invalid bearer token is distinguished from a missing token', async () => {
  const response = await request(app).get('/api/profile').set('Authorization', 'Bearer definitely-not-a-jwt');
  assert.equal(response.status, 401);
  assert.equal(response.body.error.code, 'invalid_token');
});

test('oversized JSON bodies are rejected without exposing an internal error', async () => {
  const response = await request(app).post('/api/auth/login').send({ email: 'a@example.com', password: 'x'.repeat(110_000) });
  assert.equal(response.status, 413);
  assert.equal(response.body.error.code, 'body_too_large');
});
