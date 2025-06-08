// Можно убрать после того, как перенесем создание и подрузку книг на бэк
import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/next-library';

export async function connectToDB() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URL);
      console.log('✅ Connected to MongoDB');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}
