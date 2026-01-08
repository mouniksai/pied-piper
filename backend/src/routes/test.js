import express from 'express';
import { watchGmail } from '../services/gmailService.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Trigger the "Watch" command manually
router.post('/watch', verifyToken, async (req, res) => {
  try {
    console.log(`Starting watch for User ID: ${req.userId}`);
    const response = await watchGmail(req.userId);
    res.json({ success: true, message: "Gmail Watch Started", googleResponse: response });
  } catch (error) {
    console.error("Watch Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;