import React from 'react';
import { useInventoryStore } from './useInventoryStore';
import { TrendingUp, PackageMinus, DollarSign } from 'lucide-react';

export function DashboardTab() {
  const { inventory, sales, expenses } = useInventoryStore();

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalRevenue, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="p-8 w-full bg-gray-100 min-h-screen text-gray-900">
      <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-600">Total Revenue</h3>
          </div>
          <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <PackageMinus size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-600">Total Expenses</h3>
          </div>
          <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-600">Net Profit</h3>
          </div>
          <p className="text-3xl font-bold">${netProfit.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}