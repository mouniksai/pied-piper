"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Mail, ChevronDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../src/store/useAuthStore';

const Header = () => {
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const getInitials = (name) => {
    if (!name) return 'US';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.name || "User";
  const initials = getInitials(displayName);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Call backend to clear cookies
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
        method: "POST", // or GET depending on your route, usually POST for logout
        credentials: "include"
      });
      
      // Manual cookie deletion (Frontend)
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Clear client state
      logout();
      
      // Redirect
      router.push('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative">
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
        
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <button className="p-2.5 bg-[#D8EFA8] rounded-full text-[#0A0A0A] hover:opacity-90 transition-opacity">
            <Bell size={18} />
          </button>
          <button className="p-2.5 bg-[#1C1C1E] border border-gray-800 rounded-full text-white hover:border-[#D8EFA8] transition-colors">
            <Mail size={18} />
          </button>
          
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="hidden md:flex items-center gap-2 bg-[#CDC9EF] p-1.5 pr-4 rounded-full cursor-pointer hover:opacity-90 transition-opacity select-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#0A0A0A] flex items-center justify-center">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <span className="text-[#0A0A0A] font-medium text-sm">{displayName}</span>
            <ChevronDown size={14} className={`text-[#0A0A0A] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-[#1C1C1E] border border-gray-800 rounded-xl shadow-lg py-1 z-50 overflow-hidden">
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-red-400 hover:bg-[#2C2C2E] flex items-center gap-2 transition-colors text-sm font-medium"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Header;
