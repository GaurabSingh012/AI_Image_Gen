import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Post from '../models/post.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
};

export const createPost = async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;
    
    // Upload the Base64 string to Cloudinary
    const photoUrl = await cloudinary.uploader.upload(photo);
    
    // Create the database document, attaching the verified user's ID
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.secure_url,
      creator: req.user._id // THIS IS THE PATCH: securely links image to the logged-in user
    });

    res.status(200).json({ success: true, data: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Unable to create a post, please try again' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id); 
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete post' });
  }
};