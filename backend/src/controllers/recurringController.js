import prisma from '../lib/prisma.js';

export const createRecurring = async (req, res) => {
  try {
    const { name, amount, nextDueDate } = req.body;
    const item = await prisma.recurring.create({
      data: {
        userId: req.userId,
        name,
        amount,
        nextDueDate: new Date(nextDueDate)
      }
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const getRecurring = async (req, res) => {
  const items = await prisma.recurring.findMany({ 
    where: { userId: req.userId, isActive: true } 
  });
  res.json(items);
};