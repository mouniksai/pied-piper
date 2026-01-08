import React from 'react';
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

export default Sidebar;
