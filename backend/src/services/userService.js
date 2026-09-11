import { User } from '../models/User.js';

export const listUsers = () => User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(100);
