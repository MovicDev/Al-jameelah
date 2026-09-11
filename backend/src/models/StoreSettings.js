import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'primary' },
  brandName: { type: String, required: true },
  tagline: { type: String, default: '' },
  whatsappNumber: { type: String, required: true },
  phoneDisplay: { type: String, default: '' },
  instagram: { type: String, default: '' },
  tiktok: { type: String, default: '' },
  facebook: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  shippingNotice: { type: String, default: '' },
  announcementBar: { type: String, default: '' },
  currencySymbol: { type: String, default: '₦' },
  currencyCode: { type: String, default: 'NGN' },
}, { timestamps: true });

export const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);

