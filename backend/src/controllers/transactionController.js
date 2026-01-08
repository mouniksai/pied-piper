// src/controllers/transactionController.js
import prisma from '../lib/prisma.js';

// 1. Get All Transactions (with Filters)
export const getTransactions = async (req, res) => {
  try {
    // Extract new query params: startDate, endDate
    const { page = 1, limit = 20, category, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;

    // Build the dynamic 'where' clause
    const where = {
      userId: req.userId, // Security: Only fetch own data
      
      // 1. Optional Category Filter
      ...(category && { category }), 
    };

    // 2. Optional Date Range Filter
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate); // Greater than or equal to Start
      }
      if (endDate) {
        // Set end date to end of day to include transactions on that day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end; // Less than or equal to End
      }
    }

    // Parallel fetch: Data + Count (for pagination UI)
    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit), // 3. Controls the "Limited Number"
        orderBy: { date: 'desc' }, // Newest first
        include: { splits: true }
      }),
      prisma.transaction.count({ where })
    ]);

    res.json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
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