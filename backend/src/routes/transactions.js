// src/routes/transactions.js
import express from 'express';
import { verifyToken } from '../middlewares/auth.js'; // Protect these routes!
import { getTransactions, getDashboardStats, createTransaction, updateTransaction } from '../controllers/transactionController.js';

const router = express.Router();

// Apply middleware globally to this router (All routes require login)
router.use(verifyToken);

router.get('/', getTransactions);       // GET /api/transactions
router.get('/stats', getDashboardStats); // GET /api/transactions/stats
router.post('/', createTransaction);       // POST /api/transactions (Manual Add)
router.patch('/:id', updateTransaction);

export default router;