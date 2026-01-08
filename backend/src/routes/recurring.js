import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { createRecurring, getRecurring } from '../controllers/recurringController.js';

const router = express.Router();
router.use(verifyToken);

router.post('/', createRecurring);
router.get('/', getRecurring); // GET /api/recurring

export default router;