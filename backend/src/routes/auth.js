// src/routes/auth.js
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { signup, login, logout, updateBudget, getMe } from '../controllers/authController.js';
import { watchGmail } from '../services/gmailService.js'; 
import { verifyToken } from '../middlewares/auth.js';
import { getCookieOptions } from '../lib/authUtils.js';

const router = express.Router();

// --- DIRECT AUTH ROUTES ---
router.post('/signup', signup);
router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.put('/budget', verifyToken, updateBudget);

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
  async (req, res) => {
    try {
      // A. Generate Token
      const token = jwt.sign(
        { id: req.user.id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // B. Set Cookie (Best effort for browsers that support 3rd party)
      res.cookie('token', token, getCookieOptions());


      // C. START WATCHING AUTOMATICALLY (The Magic Step)
      // We await this so we confirm connection before user sees dashboard
      console.log(`🔌 Auto-initializing Gmail Watch for ${req.user.email}...`);
      try {
        await watchGmail(req.user.id);
        console.log("✅ Gmail Watch successfully activated.");
      } catch (watchError) {
        // If watch fails (e.g. temporary Google error), LOG IT but DO NOT block login.
        // We still want the user to access the app.
        console.error("⚠️ Warning: Auto-Watch failed (User can still login):", watchError.message);
      }

      // D. Redirect to Frontend (with Token fallback for cross-site)
      const rawFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const frontendUrl = rawFrontendUrl.replace(/\/$/, "");
      
      // Pass token in query param. Frontend useAuthStore checks this.
      res.redirect(`${frontendUrl}/dashboard?token=${token}`);

    } catch (error) {
      console.error("Login Callback Error:", error);
      const rawFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const frontendUrl = rawFrontendUrl.replace(/\/$/, "");
      res.redirect(`${frontendUrl}/login?error=server_error`);
    }
  }
);

router.post('/logout', logout);

export default router;