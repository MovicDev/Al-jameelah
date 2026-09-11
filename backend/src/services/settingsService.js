import { StoreSettings } from '../models/StoreSettings.js';

export const getSettings = () => StoreSettings.findOne({ key: 'primary' });
export const updateSettings = (input) => StoreSettings.findOneAndUpdate(
  { key: 'primary' },
  { $set: input, $setOnInsert: { key: 'primary' } },
  { new: true, upsert: true, runValidators: true },
);

