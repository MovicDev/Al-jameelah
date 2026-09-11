import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
  startsAt: { type: Date, required: true, index: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending', index: true },
  notes: { type: String, default: '', maxlength: 1_000 },
}, { timestamps: true });

bookingSchema.index({ service: 1, startsAt: 1, status: 1 });
export const Booking = mongoose.model('Booking', bookingSchema);

