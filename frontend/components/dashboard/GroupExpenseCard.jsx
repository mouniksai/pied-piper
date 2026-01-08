import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from './variants';

const GroupExpenseCard = ({ toGet = 0 }) => (
  <motion.div variants={itemVariants} className="bg-[#CDC9EF] p-6 rounded-3xl relative overflow-hidden">
    <div className="relative z-10">
      <div className="text-[#0A0A0A]/70 text-sm font-medium mb-1">Total Outstanding</div>
      <h3 className="text-[#0A0A0A] text-lg font-bold mb-4">To get</h3>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-[#0A0A0A]">₹{toGet}</span>
        {/* Mock avatars kept for UI structure, ideally should come from 'splits' data */}
        <div className="flex -space-x-3 opacity-50">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-[#0A0A0A] border-2 border-[#CDC9EF]" />
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default GroupExpenseCard;
