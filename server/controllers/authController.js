import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import sendEmail from '../utils/sendEmail.js'; 

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'visionai_super_secret_key_2026', {
    expiresIn: '7d',
  });
};

// ==========================================
// UPDATE: Register with backend security validation
// ==========================================
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. STRICT BACKEND VALIDATION RULES (Do not trust front-end)
    
    // Email regex: basic pattern check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Must provide a valid email address.' });
    }

    // Password regex: Min 8 chars, 1 uppercase, 1 number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters, include one uppercase letter, and one number.' });
    }

    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required.' });
    }

    // 2. CONTINUE EXISTING LOGIC
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'User already exists.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ success: true, message: 'Account created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'Invalid credentials.' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ success: false, message: 'Invalid credentials.' });

    const token = generateToken(user._id);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, data: { _id: user._id, username: user.username, email: user.email }});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

export const logout = (req, res) => {
  res.cookie('access_token', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: 'VisionAI - Your Password Reset Code',
        message: `Your password reset code is ${otp}. It will expire in 10 minutes.`,
        otp: otp
      });

      res.status(200).json({ success: true, message: 'OTP sent to email.' });
    } catch (error) {
      user.resetPasswordOtp = null;
      user.resetPasswordOtpExpire = null;
      await user.save();
      console.error('Email sending error:', error);
      return res.status(500).json({ success: false, message: 'Email could not be sent.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error processing forgot password.' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordOtpExpire: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpire = null;
    
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error resetting password.' });
  }
};