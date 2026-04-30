import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check if the token exists in the HTTP-Only cookies
  if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route. Please log in.' });
  }

  try {
    // 2. Verify the token signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'visionai_super_secret_key_2026');

    // 3. Find the user in the database and attach them to the request object
    // We use .select('-password') to ensure we never accidentally expose the hashed password
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'The user belonging to this token no longer exists.' });
    }

    // 4. Pass control to the next middleware or controller
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ success: false, message: 'Token is invalid or expired.' });
  }
};