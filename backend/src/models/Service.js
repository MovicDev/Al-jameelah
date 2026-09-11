import mongoose from 'mongoose';
import { imageSchema } from './Product.js';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 180 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  price: { type: Number, required: true, min: 0 },
  duration: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, required: true, maxlength: 10_000 },
  benefits: { type: [String], default: [] },
  image: { type: imageSchema, default: null },
  available: { type: Boolean, default: true, index: true },
  deliverable: { type: String, default: '', maxlength: 500 },
  popular: { type: Boolean, default: false },
}, { timestamps: true });

serviceSchema.index({ name: 'text', description: 'text' });
export const Service = mongoose.model('Service', serviceSchema);

