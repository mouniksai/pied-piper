import React from 'react';
import Sidebar from '../../../components/dashboard/Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar />
      <div className="flex-1 lg:ml-64 min-h-screen relative">
        {children}
      </div>
    </div>
  );
}
