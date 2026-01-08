import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { itemVariants } from './variants';

const ExpenseDataCard = () => {
    // Mock data for bar chart
    const bars = [40, 60, 45, 80, 50, 65, 55];
    
    return (
        <motion.div variants={itemVariants} className="bg-[#1C1C1E] p-6 rounded-3xl col-span-1 lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Expense Data</h2>
                    <p className="text-gray-400 text-sm mt-1">Monthly</p>
                </div>
                <div className="text-gray-400 flex items-center gap-1 text-sm">
                    Nov 23 <ChevronDown size={14} />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <div className="text-4xl font-bold text-white">₹3450</div>
                    <div className="text-[#FF6B6B] text-sm font-bold flex items-center mt-1">
                        4.5% <ChevronDown size={14} className="ml-1" />
                    </div>
                </div>

                {/* Custom Bar Chart Visualization */}
                <div className="flex-1 h-32 flex items-end justify-between gap-2">
                    {bars.map((height, i) => (
                        <div key={i} className="w-full flex flex-col justify-end gap-2 h-full group">
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className={`w-full rounded-t-lg ${i === 3 ? 'bg-[#CDC9EF]' : i % 2 === 0 ? 'bg-[#D8EFA8]' : 'bg-[#D8EFA8]/50'}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
             <div className="flex justify-between text-xs text-gray-500 mt-4 px-2">
                <span>1 - 30 Nov'23</span>
                <span>2nd Week</span>
            </div>
        </motion.div>
    );
};

export default ExpenseDataCard;
