import { useState } from 'react';
import { InventoryItem, SaleLog, ExpenseLog } from './types';

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'item-1',
    name: 'Rice (50kg Bag)',
    category: 'Grains',
    baseUnit: 'kg',
    stockInBaseUnit: 500,
    costPerBaseUnit: 1.2,
    conversionRates: { bag: 50, kg: 1 },
    tierPrices: { retail: { bag: 75, kg: 1.8 }, wholesale: { bag: 65, kg: 1.5 }, vip: { bag: 60, kg: 1.4 } }
  }
];

export function useInventoryStore() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [sales, setSales] = useState<SaleLog[]>([]);
  const [expenses, setExpenses] = useState<ExpenseLog[]>([]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const adjustStock = (itemId: string, baseQtyDelta: number) => {
    setInventory(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, stockInBaseUnit: Math.max(0, item.stockInBaseUnit + baseQtyDelta) }
          : item
      )
    );
  };

  const logSale = (itemId: string, unitSold: string, tier: string, quantity: number) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const rate = item.conversionRates[unitSold] || 1;
    const baseQtyToDeduct = quantity * rate;
    const unitPrice = item.tierPrices[tier]?.[unitSold] || item.costPerBaseUnit * rate;
    const totalRevenue = unitPrice * quantity;
    const costOfGoods = item.costPerBaseUnit * baseQtyToDeduct;

    const newSale: SaleLog = {
      id: 'sale-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      itemId: item.id,
      itemName: item.name,
      unitSold: unitSold,
      tierApplied: tier,
      unitPrice: unitPrice,
      quantitySold: quantity,
      totalRevenue: totalRevenue,
      profit: totalRevenue - costOfGoods,
      baseQtyDeducted: baseQtyToDeduct
    };

    setSales(prev => [newSale, ...prev]);
    adjustStock(itemId, -baseQtyToDeduct);
  };

  const addExpense = (expense: Omit<ExpenseLog, 'id'>) => {
    const newExp: ExpenseLog = {
      ...expense,
      id: 'exp-' + Date.now()
    };
    setExpenses(prev => [newExp, ...prev]);
  };

  return {
    theme,
    toggleTheme,
    inventory,
    sales,
    expenses,
    adjustStock,
    logSale,
    addExpense
  };
}