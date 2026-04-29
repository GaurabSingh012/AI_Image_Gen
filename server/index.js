import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// API Endpoints
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/ai', aiRoutes);

// Root Route for status checks
app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'AI Image Generation Server is running!',
  });
});

const startServer = async () => {
  try {
    // Awaiting the DB connection ensures stability before the server goes live
    await connectDB(process.env.MONGODB_URL);
    
    app.listen(8080, () => {
      console.log('Server has started on http://localhost:8080');
    });
  } catch (error) {
    console.error('Server startup error:', error);
  }
};

startServer();