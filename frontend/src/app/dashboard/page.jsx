"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { containerVariants } from '../../../components/dashboard/variants';
import Sidebar from '../../../components/dashboard/Sidebar';
import Header from '../../../components/dashboard/Header';
import GroupExpenseCard from '../../../components/dashboard/GroupExpenseCard';
import ReceivedAmountCard from '../../../components/dashboard/ReceivedAmountCard';
import ExpenseDataCard from '../../../components/dashboard/ExpenseDataCard';
import RightStatsColumn from '../../../components/dashboard/RightStatsColumn';
import TransactionsTable from '../../../components/dashboard/TransactionsTable';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] font-san">
      <Sidebar />

      <main className="flex-auto h-screen overflow-hidden lg:ml-64 p-4 md:p-8">
        <Header />

        {/* Dashboard Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Column 1 */}
          <div className="flex flex-col gap-6 bg-amber-100">
            <GroupExpenseCard />
            <ReceivedAmountCard />
          </div>

          {/* Column 2 (Center Chart) - Spans 2 cols on Large screens */}
          <div className="lg:col-span-2 flex flex-col gap-6 bg-amber-400">
            <ExpenseDataCard />
            {/* Note: In the image, "Recent Transactions" is at the bottom spanning width. 
                    We can place it here or in a separate full-width row below.
                    Based on layout, it fits best in a grid flow or separate row. */}
          </div>

          {/* Column 3 (Right side stats) */}
          <div className="lg:col-span-1 bg-amber-600">
            <RightStatsColumn />
          </div>

          {/* Bottom Full Width Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 lg:row-start-2 lg:col-start-1 bg-app-bg">
            <TransactionsTable />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
