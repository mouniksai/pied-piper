// src/routes/splits.js
import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { splitTransaction, getDebtSummary, nudgeDebtor } from '../controllers/splitController.js';

const router = express.Router();
router.use(verifyToken);

router.post('/', splitTransaction);    // POST /api/splits (Create a split)
router.get('/summary', getDebtSummary); // GET /api/splits/summary (Dashboard)
router.post('/nudge', nudgeDebtor); // POST /api/splits/nudge (Nudge debtor)

export default router;