import mongoose from 'mongoose';

export async function connectToDb(uri) {
  await mongoose.connect(uri)
  console.log('Connected to MongoDB');
}
