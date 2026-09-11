import * as categoryService from '../services/categoryService.js';
import { sendSuccess } from '../utils/respond.js';

export const list = async (request, response) => sendSuccess(response, 200, 'Categories loaded.', { data: await categoryService.listCategories(request.user?.role === 'admin') });
export const create = async (request, response) => sendSuccess(response, 201, 'Category created successfully.', { data: await categoryService.createCategory(request.validated.body) });
export const update = async (request, response) => sendSuccess(response, 200, 'Category updated successfully.', { data: await categoryService.updateCategory(request.params.id, request.validated.body) });
export const remove = async (request, response) => { await categoryService.deleteCategory(request.params.id); sendSuccess(response, 200, 'Category deleted successfully.'); };

