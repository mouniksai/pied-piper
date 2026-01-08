"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  CreditCard, 
  FileText, 
  Settings, 
  Info, 
  Shield 
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: CreditCard, label: 'Expenses', href: '/expenses' },
    // { icon: FileText, label: 'Summary', href: '/summary' },
    // { icon: Shield, label: 'Privacy', href: '/privacy' },
  ];

  return (
    <motion.aside 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0A0A0A] border-r border-app-card p-6 z-10"
    >
      <div className="text-2xl font-bold text-white mb-10 pl-2">Dash<span className="text-app-lime">board</span></div>
      
      <nav className="space-y-2 flex-1">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-app-lime text-[#0A0A0A] font-semibold shadow-lg shadow-app-lime/20' 
                  : 'text-gray-400 hover:bg-app-card hover:text-white'
              }`}
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
};


export default Sidebar;
