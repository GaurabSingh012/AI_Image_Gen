import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Post from '../models/post.js';

dotenv.config();
const router = express.Router();

// Configure Cloudinary with your credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET ROUTE: Fetch all posts from MongoDB to display on the frontend
router.route('/').get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Fetching posts failed' });
  }
});

// POST ROUTE: Create a new post (Uploads to Cloudinary, saves to MongoDB)
router.route('/').post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;
    
    // Upload the base64 string image to Cloudinary
    const photoUrl = await cloudinary.uploader.upload(photo);

    // Create a new document in MongoDB with the secure Cloudinary URL
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.secure_url, 
    });

    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Post creation failed' });
  }
});

export default router;