import express from 'express';
import { getPosts, createPost, deletePost } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Public route: Anyone can view the gallery
router.route('/').get(getPosts);

// Protected routes: Must have a valid JWT cookie to access
router.route('/').post(protect, createPost);
router.route('/:id').delete(protect, deletePost);

export default router;