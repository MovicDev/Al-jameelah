import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { AppError } from '../utils/AppError.js';
import { toSlug } from '../utils/slug.js';

export const listCategories = (includeInactive = false) => Category.find(includeInactive ? {} : { active: true }).sort({ name: 1 });
export const createCategory = (input) => Category.create({ ...input, slug: toSlug(input.slug || input.name) });
export const updateCategory = async (id, input) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError(404, 'category_not_found', 'Category not found.');
  Object.assign(category, input, input.name || input.slug ? { slug: toSlug(input.slug || input.name || category.name) } : {});
  await category.save();
  return category;
};
export const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError(404, 'category_not_found', 'Category not found.');
  if (await Product.exists({ category: category.slug })) {
    throw new AppError(409, 'category_in_use', 'Move or delete products in this category first.');
  }
  await category.deleteOne();
};

