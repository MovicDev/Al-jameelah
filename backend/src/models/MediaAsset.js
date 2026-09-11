import mongoose from 'mongoose';

const mediaAssetSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  publicId: { type: String, required: true, unique: true },
  kind: { type: String, enum: ['avatar', 'product', 'service'], required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const MediaAsset = mongoose.model('MediaAsset', mediaAssetSchema);
