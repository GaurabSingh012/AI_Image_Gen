import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Post from '../models/post.js';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
};

// CREATE a post
export const createPost = async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;

    // Upload the base64 string to Cloudinary
    const photoUrl = await cloudinary.uploader.upload(photo);

    // Save the post metadata and the Cloudinary URL to MongoDB
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.secure_url,
    });

    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Unable to create a post, please try again' });
  }
};