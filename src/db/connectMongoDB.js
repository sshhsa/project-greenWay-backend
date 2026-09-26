import dns from 'node:dns';
import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    if (process.env.MONGO_DNS_SERVER) {
      dns.setServers([process.env.MONGO_DNS_SERVER]);
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};
