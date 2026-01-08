// src/controllers/transactionController.js
import prisma from '../lib/prisma.js';

// 1. Get All Transactions (with Filters)
export const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      userId: req.userId, // Secure: only fetch OWN data
      ...(category && { category }), // Optional filter
    };

    // Parallel fetch: Data + Count (for pagination)
    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { date: 'desc' }, // Newest first
        include: { splits: true }  // Show who owes you on this transaction
      }),
      prisma.transaction.count({ where })
    ]);

    res.json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get Transactions Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// 2. Get Dashboard Stats (Total Spent, Recent Activity)
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Aggregate: Total Spent This Month
    const aggregate = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId: req.userId,
        date: { gte: startOfMonth }
      }
    });

    // Group By Category (for Pie Chart)
    const categoryStats = await prisma.transaction.groupBy({
      by: ['category'],
      _sum: { amount: true },
      where: {
        userId: req.userId,
        date: { gte: startOfMonth }
      },
    });

    res.json({
      totalSpent: aggregate._sum.amount || 0,
      categoryBreakdown: categoryStats.map(stat => ({
        category: stat.category,
        amount: stat._sum.amount || 0
      }))
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// 3. Manual Transaction Creation
export const createTransaction = async (req, res) => {
  try {
    const { amount, merchant, date, category, description } = req.body;

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.userId,
        amount: parseFloat(amount),
        merchant: merchant || "Unknown",
        date: new Date(date), // Expect ISO string
        category: category || "Uncategorized",
        description,
        source: "MANUAL",
        currency: "INR"
      }
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Create Transaction Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// 4. Update Transaction (Categorization Fixes)
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // e.g., { category: "Food", merchant: "Zomato" }

    // Ensure user owns the transaction
    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: updates
    });

    res.json(transaction);
  } catch (error) {
    console.error("Update Transaction Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};