export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  baseUnit: string;
  stockInBaseUnit: number;
  costPerBaseUnit: number;
  conversionRates: Record<string, number>;
  tierPrices: Record<string, Record<string, number>>;
}

export interface SaleLog {
  id: string;
  date: string;
  itemId: string;
  itemName: string;
  unitSold: string;
  tierApplied: string;
  unitPrice: number;
  quantitySold: number;
  totalRevenue: number;
  profit: number;
  baseQtyDeducted: number;
}

export interface ExpenseLog {
  id: string;
  category: string;
  amount: number;
  date: string;
  note?: string;
} 