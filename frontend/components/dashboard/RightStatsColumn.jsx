import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from './variants';

const RightStatsColumn = () => (
  <div className="flex flex-col gap-4">
    <motion.div variants={itemVariants} className="bg-[#1C1C1E] p-5 rounded-3xl">
      <p className="text-gray-400 text-xs mb-1">Today's Expense</p>
      <h3 className="text-2xl font-bold text-white">₹3450</h3>
    </motion.div>

    <motion.div variants={itemVariants} className="bg-[#D8EFA8] p-5 rounded-3xl text-[#0A0A0A]">
      <p className="text-[#0A0A0A]/80 text-xs mb-1 font-medium">Pending Approval</p>
      <h3 className="text-3xl font-bold">12</h3>
    </motion.div>

    <motion.div variants={itemVariants} className="bg-[#1C1C1E] p-5 rounded-3xl">
      <p className="text-gray-400 text-xs mb-1">Today's Saving</p>
      <h3 className="text-2xl font-bold text-white">₹1000</h3>
    </motion.div>

    <motion.div variants={itemVariants} className="bg-[#1C1C1E] p-5 rounded-3xl">
      <p className="text-gray-400 text-xs mb-1">Today's Balance</p>
      <h3 className="text-2xl font-bold text-white">₹20K</h3>
    </motion.div>
  </div>
);

export default RightStatsColumn;
