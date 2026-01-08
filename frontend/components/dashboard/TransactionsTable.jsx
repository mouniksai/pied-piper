import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Plane, Briefcase, ShoppingBag, Utensils, Car, Home } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { itemVariants } from './variants';

const getCategoryIcon = (category) => {
    const map = {
        'Food': Utensils,
        'Meals': Coffee,
        'Travel': Plane,
        'Transport': Car,
        'Shopping': ShoppingBag,
        'Office Supplies': Briefcase,
        'Rent': Home,
    };
    return map[category] || ShoppingBag; // Default icon
};

const TransactionsTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/transactions?limit=3', {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setTransactions(data.transactions || []);
                }
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) {
        return (
            <motion.div variants={itemVariants} className="bg-app-card p-6 rounded-3xl col-span-1 lg:col-span-3 h-64 flex items-center justify-center">
                <p className="text-gray-400">Loading transactions...</p>
            </motion.div>
        );
    }

    return (
        <motion.div variants={itemVariants} className="bg-app-card p-6 rounded-3xl col-span-1 lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                <button className="w-8 h-8 rounded-full bg-app-lavender flex items-center justify-center text-[#0A0A0A] hover:bg-white transition-colors">
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
                        {transactions.map((t, idx) => {
                            const Icon = getCategoryIcon(t.category);
                            return (
                                <tr key={t.id || idx} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-4 pl-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#0A0A0A] flex items-center justify-center text-white border border-gray-800">
                                                <Icon size={18} />
                                            </div>
                                            <span className="font-medium text-white text-sm">{t.category}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm text-gray-300">Expense</td>
                                    <td className="py-4">
                                        <span className="bg-app-lime text-[#0A0A0A] text-xs font-bold px-3 py-1 rounded-full">
                                            Completed
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <div className="text-sm text-gray-300">{format(new Date(t.date), 'MMM d, yyyy')}</div>
                                        <div className="text-xs text-gray-500">{formatDistanceToNow(new Date(t.date), { addSuffix: true })}</div>
                                    </td>
                                    <td className="py-4 text-right pr-4 font-bold text-white">
                                        {t.amount} {t.currency || '₹'}
                                    </td>
                                </tr>
                            );
                        })}
                        {transactions.length === 0 && (
                             <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-500">
                                    No recent transactions found
                                </td>
                             </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default TransactionsTable;
