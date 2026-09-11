import mongoose from 'mongoose';

export const connectDatabase = async (uri) => {
  if (!uri) throw new Error('MONGODB_URI is required.');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
  return mongoose.connection;
};

export const disconnectDatabase = () => mongoose.disconnect();

