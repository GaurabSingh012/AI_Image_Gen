import mongoose from 'mongoose';

/**
 * Establishes connection to MongoDB Atlas
 * @param {string} url - MongoDB Connection String from environment variables
 */
const connectDB = (url) => {
  mongoose.set('strictQuery', true);
  
  mongoose.connect(url)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => {
      console.error('Failed to connect to MongoDB');
      console.error(err);
    });
};

export default connectDB;