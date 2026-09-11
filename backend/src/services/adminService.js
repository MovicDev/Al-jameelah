import { Booking } from '../models/Booking.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Service } from '../models/Service.js';
import { User } from '../models/User.js';

export const getStats = async () => {
  const [users, products, services, orders, bookings] = await Promise.all([
    User.countDocuments(), Product.countDocuments(), Service.countDocuments(), Order.countDocuments(), Booking.countDocuments(),
  ]);
  return { users, products, services, orders, bookings };
};

