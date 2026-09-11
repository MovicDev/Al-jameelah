import { Booking } from '../models/Booking.js';
import { Service } from '../models/Service.js';
import { AppError } from '../utils/AppError.js';

export const createBooking = async ({ serviceId, date, time, notes }, userId) => {
  const service = await Service.findOne({ _id: serviceId, available: true });
  if (!service) throw new AppError(422, 'service_unavailable', 'This service is not available for booking.');
  const startsAt = new Date(`${date}T${time}:00`);
  if (Number.isNaN(startsAt.getTime()) || startsAt.getTime() <= Date.now()) {
    throw new AppError(422, 'invalid_booking_time', 'Choose a valid future date and time.');
  }
  const conflict = await Booking.exists({
    service: serviceId,
    startsAt,
    status: { $in: ['pending', 'confirmed'] },
  });
  if (conflict) throw new AppError(409, 'slot_unavailable', 'That appointment time is no longer available.');
  return Booking.create({ user: userId, service: serviceId, startsAt, notes });
};

export const listBookings = (userId, isAdmin) => {
  const query = Booking.find(isAdmin ? {} : { user: userId }).populate('service', 'name duration price');
  if (isAdmin) query.populate('user', 'fullName email phone');
  return query.sort({ startsAt: 1 });
};

export const updateBookingStatus = async (id, status) => {
  const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  if (!booking) throw new AppError(404, 'booking_not_found', 'Booking not found.');
  return booking;
};
