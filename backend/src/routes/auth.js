// src/routes/auth.js
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { signup, login, logout } from '../controllers/authController.js'; // Import controller
import { sendTokenResponse } from '../lib/authUtils.js';


const router = express.Router();

// --- DIRECT AUTH ROUTES ---
router.post('/signup', signup);
router.post('/login', login);

// --- GOOGLE OAUTH ROUTES ---
router.get('/google', passport.authenticate('google', {
  scope: [
    'profile', 
    'email', 
    'https://www.googleapis.com/auth/gmail.readonly', 
    'https://www.googleapis.com/auth/contacts.readonly'
  ],
  accessType: 'offline',
  prompt: 'consent'
}));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    // Generate JWT for Google User
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    // Redirect to Frontend
    res.redirect(`http://localhost:3000//auth/callback?token=${token}`);
  }
);

router.get('/logout', logout);

export default router;