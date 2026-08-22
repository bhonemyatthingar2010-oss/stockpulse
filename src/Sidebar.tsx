import React from 'react';
import { Home, Package, DollarSign, Settings } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen p-4">
      <h1 className="text-2xl font-bold mb-8 text-blue-400">StockPulse AI</h1>
      <nav className="flex flex-col gap-4">
        <button className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
          <Home size={20} /> Dashboard
        </button>
        <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition">
          <Package size={20} /> Inventory
        </button>
        <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition">
          <DollarSign size={20} /> Sales & Expenses
        </button>
      </nav>
      <div className="mt-auto">
        <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition w-full">
          <Settings size={20} /> Settings
        </button>
      </div>
    </div>
  );
}