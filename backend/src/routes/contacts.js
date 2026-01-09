// src/routes/contacts.js
import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { fetchGoogleContacts } from '../services/contactService.js';

const router = express.Router();
router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const contacts = await fetchGoogleContacts(req.userId);
    res.json(contacts);
  } catch (error) {
    console.error("Contacts Error:", error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

export default router;