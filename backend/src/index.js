// src/index.js
import 'dotenv/config';

// STRICT ENV CHECK
const requiredEnv = ['JWT_SECRET', 'GEMINI_API_KEY', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`🚨 CRITICAL: Missing environment variables: ${missingEnv.join(', ')}`);
  // process.exit(1); // Commented out to prevent crash if running locally without all keys for dev
}

import express from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import configurePassport from './config/passport.js';
import authRoutes from './routes/auth.js';
import webhookRoutes from './routes/webhooks.js';
import prisma from './lib/prisma.js';
import { verifyToken } from './middlewares/auth.js';
import testRoutes from './routes/test.js';
import transactionRoutes from './routes/transactions.js';
import contactRoutes from './routes/contacts.js';
import splitRoutes from './routes/splits.js';

// Config Passport
configurePassport(passport);

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('Welcome to ARGOS Backend!');
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/splits', splitRoutes);

// Protected Route Example
app.get('/api/me', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId }});
    res.json(user);
  } catch(e) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`🛡️  ARGOS Backend running on http://localhost:${PORT}`);
});