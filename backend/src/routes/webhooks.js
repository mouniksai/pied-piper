// src/routes/webhooks.js
import express from 'express';
import { handleGmailWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Route: POST /api/webhooks/gmail
router.post('/gmail', handleGmailWebhook);

export default router;