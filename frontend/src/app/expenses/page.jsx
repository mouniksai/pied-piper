"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Tag, 
  Share2, 
  FileText, 
  Copy,
  ChevronDown,
  Calendar
} from 'lucide-react';

// --- PALETTE CONSTANTS ---
// Bg: #0A0A0A | Card: #1C1C1E | Text: #FFFFFF | Lime: #D8EFA8 | Lavender: #CDC9EF

// --- MOCK DATA ---
const transactions = [
  { 
    id: 1, 
    merchant: "Starbucks Coffee", 
    date: "Oct 24, 2023", 
    time: "08:30 AM",
    amount: -450, 
    type: "expense",
    category: "Food & Drink", 
    bankName: "HDFC Bank",
    accountLast4: "4022",
    status: "Completed",
    utr: "HDFCN23102488392",
    sourceSnippet: "Dear Customer, INR 450.00 debited from a/c **4022 on 24-10-23 to VPA starbucks@hdfc. Info: COFFEE. Avl Bal: INR 24,000."
  },
  { 
    id: 2, 
    merchant: "Client Payment - Upwork", 
    date: "Oct 23, 2023", 
    time: "02:15 PM",
    amount: 12500, 
    type: "income",
    category: "Freelance", 
    bankName: "HDFC Bank",
    accountLast4: "4022",
    status: "Completed",
    utr: "UPW23102399100",
    sourceSnippet: "Credit Alert: INR 12,500.00 credited to a/c **4022 on 23-10-23 via NEFT. Ref: UPW23102399100. Avl Bal: INR 24,450."
  },
  { 
    id: 3, 
    merchant: "Uber Ride", 
    date: "Oct 22, 2023", 
    time: "09:45 PM",
    amount: -320, 
    type: "expense",
    category: "Travel", 
    bankName: "HDFC Bank",
    accountLast4: "4022",
    status: "Completed",
    utr: "UBR23102277481",
    sourceSnippet: "Dear Customer, INR 320.00 debited from a/c **4022 on 22-10-23 to VPA uber@axis. Info: RIDE. Avl Bal: INR 11,950."
  },
  { 
    id: 4, 
    merchant: "Amazon Purchase", 
    date: "Oct 20, 2023", 
    time: "11:20 AM",
    amount: -2100, 
    type: "expense",
    category: "Shopping", 
    bankName: "SBI Savings",
    accountLast4: "8812",
    status: "Completed",
    utr: "AMZ23102011234",
    sourceSnippet: "Txn Alert: INR 2,100.00 debited from a/c **8812 via Debit Card at AMAZON RETAIL. Ref: 774839201."
  },
];

// --- ANIMATION VARIANTS ---
const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const rowVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", duration: 0.4 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

// --- COMPONENTS ---

// 1. Transaction Inspector Modal
const TransactionInspector = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const isExpense = transaction.type === "expense";
  const amountColor = isExpense ? "text-[#FF6B6B]" : "text-[#D8EFA8]";
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-[#1C1C1E] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-white/5"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/5 relative">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center mt-2">
            <div className={`text-4xl font-bold mb-2 ${amountColor}`}>
              {isExpense ? '-' : '+'}{Math.abs(transaction.amount)}
            </div>
            <h2 className="text-xl font-semibold text-white">{transaction.merchant}</h2>
            <div className="text-gray-400 text-sm mt-1 flex items-center gap-2">
              <Calendar size={14} /> {transaction.date} at {transaction.time}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          {/* Bank Details */}
          <div className="bg-[#0A0A0A] p-4 rounded-xl flex items-center justify-between border border-white/5">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center text-[#D8EFA8]">
                 <CreditCard size={20} />
               </div>
               <div>
                 <p className="text-xs text-gray-400">Paid via</p>
                 <p className="text-white font-medium">{transaction.bankName}</p>
               </div>
             </div>
             <div className="text-right">
               <p className="text-xs text-gray-400">Account</p>
               <p className="text-white font-mono">•••• {transaction.accountLast4}</p>
             </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2 block">Category</label>
            <div className="relative">
              <select 
                className="w-full bg-[#0A0A0A] text-white border border-white/10 rounded-xl p-3 appearance-none focus:border-[#D8EFA8] focus:outline-none transition-colors"
                defaultValue={transaction.category}
              >
                <option>Food & Drink</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Utilities</option>
                <option>Freelance</option>
              </select>
              <Tag className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center gap-2 bg-[#CDC9EF] hover:bg-[#b8b3e6] text-[#0A0A0A] p-4 rounded-xl transition-colors font-semibold">
              <Share2 size={20} />
              <span>Split This</span>
            </button>
            <div className="bg-[#0A0A0A] p-4 rounded-xl border border-white/10 focus-within:border-[#D8EFA8] transition-colors">
              <div className="flex items-center gap-2 mb-2 text-gray-400">
                <FileText size={16} />
                <span className="text-xs font-bold">Add Note</span>
              </div>
              <textarea 
                placeholder="Ex: Dinner for Mom's bday..."
                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-gray-600 resize-none h-12"
              />
            </div>
          </div>

          {/* Technical Proof */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3">Technical Proof</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">UTR / Ref No.</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono text-sm">{transaction.utr}</span>
                  <Copy size={12} className="text-[#D8EFA8] cursor-pointer" />
                </div>
              </div>

              <div className="bg-[#0A0A0A] p-3 rounded-lg border border-dashed border-gray-700">
                <p className="text-[10px] text-gray-500 font-mono mb-1 uppercase">Source Snippet (Email)</p>
                <p className="text-gray-300 font-mono text-xs leading-relaxed opacity-80">
                  {transaction.sourceSnippet}
                </p>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
};

export default function ExpensesPage() {
  const [selectedTx, setSelectedTx] = useState(null);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans p-6 md:p-12">
      
      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Expenses & Transactions</h1>
          <p className="text-gray-400 mt-1">Track and manage your financial footprint.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-[#1C1C1E] text-white px-4 py-2.5 rounded-xl border border-gray-800 hover:border-[#D8EFA8] transition-colors">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 bg-[#D8EFA8] text-[#0A0A0A] px-4 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity">
            <ArrowDownLeft size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </header>

      {/* Transaction List Container */}
      <motion.div 
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="bg-[#1C1C1E] rounded-3xl overflow-hidden shadow-lg"
      >
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-5 border-b border-gray-800 text-xs text-gray-500 uppercase font-bold tracking-wider">
          <div className="col-span-5 md:col-span-4 pl-2">Merchant / Detail</div>
          <div className="col-span-3 md:col-span-2 hidden md:block">Date</div>
          <div className="col-span-3 md:col-span-2 hidden md:block">Category</div>
          <div className="col-span-3 md:col-span-2 text-center hidden md:block">Status</div>
          <div className="col-span-7 md:col-span-2 text-right pr-2">Amount</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-800/50">
          {transactions.map((tx) => (
            <motion.div 
              key={tx.id}
              variants={rowVariants}
              onClick={() => setSelectedTx(tx)}
              className="grid grid-cols-12 gap-4 p-5 hover:bg-white/5 cursor-pointer transition-colors group items-center"
            >
              {/* Merchant Col */}
              <div className="col-span-5 md:col-span-4 pl-2 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'expense' ? 'bg-gray-800 text-white' : 'bg-[#D8EFA8]/20 text-[#D8EFA8]'}`}>
                  {tx.type === 'expense' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                </div>
                <div>
                    <h3 className="font-medium text-white group-hover:text-[#CDC9EF] transition-colors line-clamp-1">{tx.merchant}</h3>
                    <p className="text-xs text-gray-500 md:hidden">{tx.date}</p>
                </div>
              </div>

              {/* Date Col */}
              <div className="col-span-3 md:col-span-2 hidden md:flex flex-col justify-center text-sm text-gray-400">
                <span>{tx.date}</span>
                <span className="text-xs text-gray-600">{tx.time}</span>
              </div>

              {/* Category Col */}
              <div className="col-span-3 md:col-span-2 hidden md:flex items-center">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#0A0A0A] border border-gray-800 text-gray-300">
                  {tx.category}
                </span>
              </div>

              {/* Status Col */}
              <div className="col-span-3 md:col-span-2 hidden md:flex justify-center">
                 {tx.status === 'Completed' && (
                   <span className="w-2 h-2 rounded-full bg-[#D8EFA8] shadow-[0_0_8px_#D8EFA8]" />
                 )}
              </div>

              {/* Amount Col */}
              <div className={`col-span-7 md:col-span-2 text-right pr-2 font-bold ${tx.type === 'expense' ? 'text-white' : 'text-[#D8EFA8]'}`}>
                {tx.type === 'expense' ? '-' : '+'} ₹{Math.abs(tx.amount)}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* MODAL IMPLEMENTATION */}
      <AnimatePresence>
        {selectedTx && (
          <TransactionInspector 
            transaction={selectedTx} 
            onClose={() => setSelectedTx(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}