"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  CreditCard, 
  FileText, 
  Settings, 
  Info, 
  Shield, 
  Search, 
  Bell, 
  Mail, 
  ChevronDown, 
  MoreHorizontal,
  Coffee,
  Plane,
  Briefcase
} from 'lucide-react';

// --- COLOR PALETTE CONSTANTS (Reference) ---
// Bg: #0A0A0A
// Card: #1C1C1E
// Text: #FFFFFF
// Lime: #D8EFA8
// Lavender: #CDC9EF

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

// --- COMPONENTS ---

// 1. Sidebar Component
const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: CreditCard, label: 'Expenses' },
    { icon: FileText, label: 'Reports' },
    { icon: Settings, label: 'Settings' },
    { icon: Info, label: 'About Us' },
    { icon: Shield, label: 'Privacy' },
  ];

  return (
    <motion.aside 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0A0A0A] border-r border-[#1C1C1E] p-6 z-10"
    >
      <div className="text-2xl font-bold text-white mb-10 pl-2">Dash<span className="text-[#D8EFA8]">board</span></div>
      
      <nav className="space-y-2 flex-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 ${
              item.active 
                ? 'bg-[#D8EFA8] text-[#0A0A0A] font-semibold shadow-lg shadow-[#D8EFA8]/20' 
                : 'text-gray-400 hover:bg-[#1C1C1E] hover:text-white'
            }`}
          >
            <item.icon size={20} className="mr-3" />
            {item.label}
          </button>
        ))}
      </nav>
    </motion.aside>
  );
};

// 2. Header Component
const Header = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
      
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative flex-1 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-[#1C1C1E] text-white rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-1 focus:ring-[#D8EFA8] transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-[#D8EFA8] rounded-full text-[#0A0A0A] hover:opacity-90 transition-opacity">
            <Bell size={18} />
          </button>
          <button className="p-2.5 bg-[#1C1C1E] border border-gray-800 rounded-full text-white hover:border-[#D8EFA8] transition-colors">
            <Mail size={18} />
          </button>
          
          <div className="hidden md:flex items-center gap-2 bg-[#CDC9EF] p-1.5 pr-4 rounded-full cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-[#0A0A0A] flex items-center justify-center">
              <span className="text-white text-xs font-bold">KC</span>
            </div>
            <span className="text-[#0A0A0A] font-medium text-sm">Kevin Christian</span>
            <ChevronDown size={14} className="text-[#0A0A0A]" />
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Widget: Group Expense
const GroupExpenseCard = () => (
  <motion.div variants={itemVariants} className="bg-[#CDC9EF] p-6 rounded-3xl relative overflow-hidden">
    <div className="relative z-10">
      <div className="text-[#0A0A0A]/70 text-sm font-medium mb-1">Today</div>
      <h3 className="text-[#0A0A0A] text-lg font-bold mb-4">New Group Expense</h3>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-[#0A0A0A]">₹4450</span>
        <div className="flex -space-x-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-[#0A0A0A] border-2 border-[#CDC9EF]" />
          ))}
          <div className="w-8 h-8 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-xs border-2 border-[#CDC9EF] font-bold">
            +2
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// 4. Widget: Received Amount (Chart)
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

// 5. Widget: Main Expense Data
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

// 6. Right Column Stats
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

// 7. Recent Transactions Table
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

// --- MAIN LAYOUT COMPONENT ---

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans selection:bg-[#D8EFA8] selection:text-black">
      <Sidebar />
      
      <main className="lg:ml-64 p-4 md:p-8">
        <Header />
        
        {/* Dashboard Grid */}
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Column 1 */}
            <div className="flex flex-col gap-6">
                <GroupExpenseCard />
                <ReceivedAmountCard />
            </div>

            {/* Column 2 (Center Chart) - Spans 2 cols on Large screens */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                <ExpenseDataCard />
                {/* Note: In the image, "Recent Transactions" is at the bottom spanning width. 
                    We can place it here or in a separate full-width row below.
                    Based on layout, it fits best in a grid flow or separate row. */}
            </div>

            {/* Column 3 (Right side stats) */}
            <div className="lg:col-span-1">
                <RightStatsColumn />
            </div>

            {/* Bottom Full Width Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 lg:row-start-2 lg:col-start-1">
                <TransactionsTable />
            </div>
        </motion.div>
      </main>
    </div>
  );
}