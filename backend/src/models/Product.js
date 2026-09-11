import mongoose from 'mongoose';

export const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: '' },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 180 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  images: { type: [imageSchema], default: [] },
  stock: { type: Number, required: true, min: 0, default: 0 },
  stockStatus: { type: String, enum: ['in_stock', 'out_of_stock', 'low_stock'], default: 'in_stock' },
  status: { type: String, enum: ['available', 'out_of_stock', 'hidden'], default: 'available', index: true },
  featured: { type: Boolean, default: false },
  size: { type: String, trim: true, default: 'Standard' },
  description: { type: String, required: true, maxlength: 10_000 },
  shortDescription: { type: String, default: '', maxlength: 500 },
  benefits: { type: [String], default: [] },
  ingredients: { type: [String], default: [] },
  howToUse: { type: String, default: '', maxlength: 5_000 },
  hairTypes: { type: [String], default: [] },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, min: 0, default: 0 },
  sku: { type: String, trim: true, unique: true, sparse: true },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', shortDescription: 'text' });

export const Product = mongoose.model('Product', productSchema);

