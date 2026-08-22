import React from 'react';
import { Sidebar } from './Sidebar';
import { DashboardTab } from './DashboardTab';

export default function App() {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <DashboardTab />
      </div>
    </div>
  );
}