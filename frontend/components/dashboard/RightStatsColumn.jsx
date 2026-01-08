import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from './variants';
import BudgetCard from './BudgetCard';

const RightStatsColumn = ({ 
  todayExpense = 0, 
  pendingCount = 0,
  budget = 0,
  spent = 0,
  onBudgetSet
}) => (
  <div className="flex flex-col gap-4">
    <motion.div variants={itemVariants} className="bg-[#1C1C1E] p-5 rounded-3xl">
      <p className="text-gray-400 text-xs mb-1">Today&lsquo;s Expense</p>
      <h3 className="text-2xl font-bold text-white">₹{todayExpense}</h3>
    </motion.div>

    <BudgetCard budget={budget} spent={spent} onBudgetSet={onBudgetSet} />
  </div>
);

export default RightStatsColumn;
