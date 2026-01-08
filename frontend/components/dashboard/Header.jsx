import React from 'react';
import { Search, Bell, Mail, ChevronDown } from 'lucide-react';

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

export default Header;
