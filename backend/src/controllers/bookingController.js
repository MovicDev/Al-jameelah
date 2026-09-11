import * as bookingService from '../services/bookingService.js';
import { sendSuccess } from '../utils/respond.js';

export const create = async (request, response) => sendSuccess(response, 201, 'Booking requested successfully.', {
  data: await bookingService.createBooking(request.validated.body, request.user.id),
});
export const list = async (request, response) => sendSuccess(response, 200, 'Bookings loaded.', {
  data: await bookingService.listBookings(request.user.id, request.user.role === 'admin'),
});
export const updateStatus = async (request, response) => sendSuccess(response, 200, 'Booking status updated.', {
  data: await bookingService.updateBookingStatus(request.params.id, request.validated.body.status),
});

