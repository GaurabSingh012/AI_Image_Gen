import express from 'express';
import { register, login, logout, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// New Password Reset Routes
router.post('/forgot-password', forgotPassword); // Requests the OTP
router.post('/reset-password', resetPassword);   // Submits OTP + New Password

export default router;