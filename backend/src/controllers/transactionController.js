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

// 2. Get Dashboard Stats (Total Spent, Recent Activity, Monthly Chart)
export const getDashboardStats = async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    
    // Use provided month/year or default to current
    const currentYear = year ? parseInt(year) : now.getFullYear();
    const currentMonth = month ? parseInt(month) - 1 : now.getMonth(); // 0-indexed in JS Date

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    const startOfPrevMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfPrevMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    // Get User Budget
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { monthlyBudget: true }
    });

    // 1. Total Spent This Month
    const currentMonthAgg = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId: req.userId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    // 2. Total Spent Previous Month (For Trend)
    const prevMonthAgg = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId: req.userId,
        date: {
          gte: startOfPrevMonth,
          lte: endOfPrevMonth
        }
      }
    });

    const currentTotal = currentMonthAgg._sum.amount ? parseFloat(currentMonthAgg._sum.amount) : 0;
    const prevTotal = prevMonthAgg._sum.amount ? parseFloat(prevMonthAgg._sum.amount) : 0;

    // Calculate Trend
    let trendValue = 0;
    let isIncrease = false;
    if (prevTotal > 0) {
      trendValue = ((currentTotal - prevTotal) / prevTotal) * 100;
      isIncrease = trendValue > 0;
    }

    // 3. Category Breakdown
    const categoryStats = await prisma.transaction.groupBy({
      by: ['category'],
      _sum: { amount: true },
      where: {
        userId: req.userId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
    });

    // 4. Daily Stats for Chart
    // ... (existing code explanation) ...
    // ...
    
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      select: {
        date: true,
        amount: true
      }
    });

    // Initialize day map
    const daysInMonth = endOfMonth.getDate();
    const dailyData = new Array(daysInMonth).fill(0);

    transactions.forEach(t => {
      const day = new Date(t.date).getDate(); // 1-31
      if (day >= 1 && day <= daysInMonth) {
        dailyData[day - 1] += parseFloat(t.amount);
      }
    });

    // --- NEW: Global Stats (Today, Splits, counts) ---
    // These are independent of the month filter usually, but "Today" is specific to "Now".
    // 1. Today's Expense
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayStats = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId: req.userId,
        date: { gte: todayStart, lte: todayEnd }
      }
    });

    // 2. Pending Approval (Uncategorized count)
    const uncategorizedCount = await prisma.transaction.count({
      where: {
        userId: req.userId,
        category: "Uncategorized"
      }
    });

    // 3. To Get (Money owe to me)
    // Find Splits where I am the owner of the Transaction (implicitly handled by transaction relation if we query properly)
    // Wait, Split model links to Transaction. Transaction links to User.
    // So splits on MY transactions are money owed TO me.
    const toGetStats = await prisma.split.aggregate({
      _sum: { amount: true },
      where: {
        transaction: {
          userId: req.userId
        },
        status: "PENDING"
      }
    });

    // 4. To Pay (Money I owe others) - Checking where I am the 'owedByUserId'
    const toPayStats = await prisma.split.aggregate({
      _sum: { amount: true },
      where: {
        owedByUserId: req.userId,
        status: "PENDING"
      }
    });

    res.json({
      totalSpent: currentTotal,
      prevTotalSpent: prevTotal,
      trend: {
        value: Math.abs(trendValue).toFixed(1),
        isIncrease: isIncrease,
        isPositive: !isIncrease
      },
      categoryBreakdown: categoryStats.map(stat => ({
        category: stat.category,
        amount: parseFloat(stat._sum.amount || 0)
      })),
      dailyStats: dailyData,
      // Global/Sidebar Stats
      todayExpense: parseFloat(todayStats._sum.amount || 0),
      pendingCount: uncategorizedCount,
      youOwe: parseFloat(toPayStats._sum.amount || 0),
      owedToYou: parseFloat(toGetStats._sum.amount || 0),
      // Budget Logic
      budget: user?.monthlyBudget ? Number(user.monthlyBudget) : 0,
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