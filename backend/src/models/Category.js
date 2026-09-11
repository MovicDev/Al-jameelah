import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  description: { type: String, default: '', maxlength: 500 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema);

