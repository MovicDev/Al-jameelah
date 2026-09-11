import * as productService from '../services/productService.js';
import { serializeProduct } from '../serializers/index.js';
import { sendSuccess } from '../utils/respond.js';

export const list = async (request, response) => {
  const result = await productService.listProducts(request.query, request.user?.role === 'admin');
  sendSuccess(response, 200, 'Products loaded.', { data: result.items.map(serializeProduct), pagination: result.pagination });
};
export const get = async (request, response) => sendSuccess(response, 200, 'Product loaded.', { data: serializeProduct(await productService.getProduct(request.params.id)) });
export const create = async (request, response) => sendSuccess(response, 201, 'Product created successfully.', { data: serializeProduct(await productService.createProduct(request.validated.body)) });
export const update = async (request, response) => sendSuccess(response, 200, 'Product updated successfully.', { data: serializeProduct(await productService.updateProduct(request.params.id, request.validated.body)) });
export const remove = async (request, response) => { await productService.deleteProduct(request.params.id); sendSuccess(response, 200, 'Product deleted successfully.'); };

