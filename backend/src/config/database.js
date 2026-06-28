import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

export async function connectToDb() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB');
}
