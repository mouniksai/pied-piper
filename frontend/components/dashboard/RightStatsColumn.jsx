import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from './variants';

const RightStatsColumn = ({ 
  todayExpense = 0, 
  pendingCount = 0 
}) => (
  <div className="flex flex-col gap-4">
    <motion.div variants={itemVariants} className="bg-[#1C1C1E] p-5 rounded-3xl">
      <p className="text-gray-400 text-xs mb-1">Today&lsquo;s Expense</p>
      <h3 className="text-2xl font-bold text-white">₹{todayExpense}</h3>
    </motion.div>

    <motion.div variants={itemVariants} className="bg-[#D8EFA8] p-5 rounded-3xl text-[#0A0A0A]">
      <p className="text-[#0A0A0A]/80 text-xs mb-1 font-medium">Pending Approval</p>
      <h3 className="text-3xl font-bold">{pendingCount}</h3>
    </motion.div>
    
    {/* 
      Placeholders: 'Saving' and 'Balance' are not yet tracked by backend.
      Keeping structure but with static/safe values or commented out if prefered.
      For now, we'll keep them as static prompts for future features.
    */}
    <motion.div variants={itemVariants} className="bg-[#1C1C1E] p-5 rounded-3xl opacity-50">
      <p className="text-gray-400 text-xs mb-1">Today&apos;s Saving</p>
      <h3 className="text-2xl font-bold text-white">--</h3>
    </motion.div>

    <motion.div variants={itemVariants} className="bg-[#1C1C1E] p-5 rounded-3xl opacity-50">
      <p className="text-gray-400 text-xs mb-1">Active Balance</p>
      <h3 className="text-2xl font-bold text-white">--</h3>
    </motion.div>
  </div>
);

export default RightStatsColumn;
