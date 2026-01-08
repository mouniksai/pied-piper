import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from './variants';

const ReceivedAmountCard = () => (
  <motion.div variants={itemVariants} className="bg-[#1C1C1E] p-6 rounded-3xl flex flex-col justify-between">
    <div>
      <div className="text-gray-400 text-xs mb-1">2 Nov 23 - 3 Nov 23</div>
      <h3 className="text-white text-md font-medium">Received Amount</h3>
      <div className="text-2xl font-bold text-white mt-1">₹1450</div>
    </div>
    
    <div className="h-16 mt-4 flex items-end justify-between gap-1">
      {/* Simulated Line Chart using SVG */}
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
        <motion.path
          d="M0 30 Q 10 20, 20 25 T 40 10 T 60 30 T 80 5 T 100 20"
          fill="none"
          stroke="#CDC9EF"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M0 30 Q 10 20, 20 25 T 40 10 T 60 30 T 80 5 T 100 20 V 50 H 0 Z"
          fill="url(#gradient)"
          opacity="0.2"
        />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CDC9EF" />
            <stop offset="100%" stopColor="#CDC9EF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div className="flex justify-between text-[10px] text-gray-500 mt-2 uppercase">
        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
    </div>
  </motion.div>
);

export default ReceivedAmountCard;
