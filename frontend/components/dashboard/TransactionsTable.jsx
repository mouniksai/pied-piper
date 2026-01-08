import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Plane, Briefcase } from 'lucide-react';
import { itemVariants } from './variants';

const TransactionsTable = () => {
    const transactions = [
        { icon: Coffee, category: 'Meals', type: 'Expense', status: 'Pending', date: 'Oct 8, 2023', time: '12 min ago', amount: '500 ₹' },
        { icon: Plane, category: 'Travel', type: 'Expense', status: 'Pending', date: 'Oct 7, 2023', time: '1 day ago', amount: '1500 ₹' },
        { icon: Briefcase, category: 'Office Supplies', type: 'Expense', status: 'Pending', date: 'Oct 4, 2023', time: '2 day ago', amount: '2300 ₹' },
    ];

    return (
        <motion.div variants={itemVariants} className="bg-[#1C1C1E] p-6 rounded-3xl col-span-1 lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                <button className="w-8 h-8 rounded-full bg-[#CDC9EF] flex items-center justify-center text-[#0A0A0A] hover:bg-white transition-colors">
                    <span className="text-lg font-bold">↗</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
                            <th className="pb-3 pl-4 font-normal">Category</th>
                            <th className="pb-3 font-normal">Transaction Type</th>
                            <th className="pb-3 font-normal">Status</th>
                            <th className="pb-3 font-normal">Time</th>
                            <th className="pb-3 font-normal text-right pr-4">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t, idx) => (
                            <tr key={idx} className="group hover:bg-white/5 transition-colors">
                                <td className="py-4 pl-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#0A0A0A] flex items-center justify-center text-white border border-gray-800">
                                            <t.icon size={18} />
                                        </div>
                                        <span className="font-medium text-white text-sm">{t.category}</span>
                                    </div>
                                </td>
                                <td className="py-4 text-sm text-gray-300">{t.type}</td>
                                <td className="py-4">
                                    <span className="bg-[#D8EFA8] text-[#0A0A0A] text-xs font-bold px-3 py-1 rounded-full">
                                        {t.status}
                                    </span>
                                </td>
                                <td className="py-4">
                                    <div className="text-sm text-gray-300">{t.date}</div>
                                    <div className="text-xs text-gray-500">{t.time}</div>
                                </td>
                                <td className="py-4 text-right pr-4 font-bold text-white">{t.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default TransactionsTable;
