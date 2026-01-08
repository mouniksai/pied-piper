// src/controllers/splitController.js
import prisma from '../lib/prisma.js';
import { sendNudge } from '../services/emailService.js';

// 1. Split a Transaction
export const splitTransaction = async (req, res) => {
  try {
    const { transactionId, splits } = req.body; 

    if (!Array.isArray(splits) || splits.length === 0) {
      return res.status(400).json({ error: "Invalid splits data. Must be a non-empty array." });
    }

    // Verify ownership
    const transaction = await prisma.transaction.findUnique({ 
      where: { id: transactionId } 
    });
    
    if (!transaction || transaction.userId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Mark transaction as split
      await tx.transaction.update({
        where: { id: transactionId },
        data: { isSplit: true }
      });

      // 2. Create Split entries
      for (const split of splits) {
        const existingFriend = await tx.user.findUnique({
          where: { email: split.email }
        });

        await tx.split.create({
          data: {
            transactionId,
            // payerId: req.userId, <--- DELETED THIS LINE
            owedByUserId: existingFriend ? existingFriend.id : null,
            owedByName: split.name,
            owedByEmail: split.email,
            amount: split.amount,
            status: 'PENDING'
          }
        });
      }
    });

    res.json({ success: true, message: "Split created successfully" });

  } catch (error) {
    console.error("Split Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// src/controllers/splitController.js

export const getDebtSummary = async (req, res) => {
  try {
    // A. Money Owed TO ME (I paid, someone else owes)
    // Logic: Find splits where the parent Transaction belongs to me
    const owedToMe = await prisma.split.findMany({
      where: { 
        transaction: {
          userId: req.userId // <--- FILTER VIA RELATION
        },
        status: 'PENDING'
      },
      include: { transaction: true }
    });

    // B. Money I OWE (Someone else paid, I am the debtor)
    const iOwe = await prisma.split.findMany({
      where: { 
        owedByUserId: req.userId,
        status: 'PENDING'
      },
      include: { 
        transaction: {
          include: { user: { select: { name: true, email: true } } } // Show who I owe
        }
      }
    });

    res.json({ owedToMe, iOwe });

  } catch (error) {
    console.error("Debt Summary Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const nudgeDebtor = async (req, res) => {
  try {
    const { splitId, strictness } = req.body; // strictness: 'POLITE', 'FIRM', 'AGGRESSIVE'

    // 1. Get Split Details
    const split = await prisma.split.findUnique({
      where: { id: splitId },
      include: { 
        transaction: {
          include: { user: true }
        }
      }
    });

    if (!split) return res.status(404).json({ error: "Split not found" });

    // Ensure only the Payer can nudge
    if (split.transaction.userId !== req.userId) {
      return res.status(403).json({ error: "Only the payer can send reminders" });
    }

    if (!split.owedByEmail) {
      return res.status(400).json({ error: "Debtor has no email address" });
    }

    // 2. Send Email
    const sent = await sendNudge(
      split.owedByEmail,
      split.transaction.user.name || "Your Friend",
      split.amount,
      split.transaction.merchant || "Expense",
      strictness
    );

    if (sent) {
      // 3. Update DB Stats
      await prisma.split.update({
        where: { id: splitId },
        data: {
          reminderCount: { increment: 1 },
          lastRemindedAt: new Date()
        }
      });
      res.json({ success: true, message: "Nudge sent successfully" });
    } else {
      res.status(500).json({ error: "Failed to send email" });
    }

  } catch (error) {
    console.error("Nudge Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};