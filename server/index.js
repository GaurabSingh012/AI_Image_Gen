import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true, 
}));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// API Endpoints
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/auth', authRoutes);

// Root route for testing
app.get('/', async (req, res) => {
  res.send('VisionAI Backend is fully operational');
});

// Server Initialization
const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    // Best practice: Use environment port if available
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server has started on port http://localhost:${PORT}`));
  } catch (error) {
    console.log('Failed to connect to MongoDB:', error);
  }
};

startServer();