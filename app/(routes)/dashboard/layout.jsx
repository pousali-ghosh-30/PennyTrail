"use client";
import React from 'react';
import SideNav from './_components/SideNav';
import DashboardHeader from './_components/DashboardHeader';

function DashboardLayout({ children }) {
  return (
    <div>
      {/* Sidebar */}
      <div className="fixed md:w-64 hidden md:block">
        <SideNav />
      </div>

      {/* Main Content */}
      <div className="md:ml-64">
        <DashboardHeader /> {/* Now includes Search + Notification */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;

