import { Product } from '../models/Product.js';
import { AppError } from '../utils/AppError.js';
import { toSlug } from '../utils/slug.js';
import { deleteImages } from './cloudinaryService.js';
import { resolveImage } from './mediaService.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalizeImages = (images = []) => Promise.all(images.map(resolveImage));

export const listProducts = async (query, isAdmin = false) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 24));
  const filter = {};
  if (!isAdmin) filter.status = { $ne: 'hidden' };
  if (query.category) filter.category = query.category;
  if (query.status && isAdmin) filter.status = query.status;
  if (query.search) {
    const pattern = new RegExp(escapeRegex(String(query.search).slice(0, 100)), 'i');
    filter.$or = [{ name: pattern }, { description: pattern }, { shortDescription: pattern }];
  }
  const sortOptions = {
    newest: { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    featured: { featured: -1, createdAt: -1 },
  };
  const sort = sortOptions[query.sort] ?? sortOptions.featured;
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filter),
  ]);
  return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new AppError(404, 'product_not_found', 'Product not found.');
  return product;
};

export const createProduct = async (input) => Product.create({
  ...input,
  discountPrice: input.discountPrice ?? undefined,
  slug: toSlug(input.slug || input.name),
  stockStatus: input.stockStatus ?? (input.stock === 0 ? 'out_of_stock' : 'in_stock'),
  images: await normalizeImages(input.images),
});

export const updateProduct = async (id, input) => {
  const product = await getProduct(id);
  const nextPrice = input.price ?? product.price;
  const nextDiscountPrice = 'discountPrice' in input ? input.discountPrice : product.discountPrice;
  if (nextDiscountPrice != null && nextDiscountPrice > nextPrice) {
    throw new AppError(422, 'invalid_discount', 'Discount price cannot exceed the regular price.');
  }
  const previousPublicIds = product.images.map((image) => image.publicId);
  Object.assign(product, input, input.name || input.slug ? { slug: toSlug(input.slug || input.name || product.name) } : {});
  if ('images' in input) product.images = await normalizeImages(input.images);
  if ('stock' in input && !input.stockStatus) product.stockStatus = input.stock === 0 ? 'out_of_stock' : 'in_stock';
  await product.save();
  if ('images' in input) {
    const retained = new Set(product.images.map((image) => image.publicId));
    await deleteImages(previousPublicIds.filter((idValue) => !retained.has(idValue)));
  }
  return product;
};

export const deleteProduct = async (id) => {
  const product = await getProduct(id);
  await product.deleteOne();
  await deleteImages(product.images.map((image) => image.publicId));
};
