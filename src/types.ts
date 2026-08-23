export type PriceTier = "retail" | "wholesale" | "vip";

export type UnitDefinition = {
  id: string;
  name: string; // e.g., "Bag", "Half-Bag", "kg"
  multiplier: number; // how many base units (kg) this unit equals
};

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  baseUnit: string; // e.g., "kg"
  baseQuantity: number; // quantity in baseUnit (kg)
  units: UnitDefinition[]; // available units with multipliers
  price: { retail: number; wholesale: number; vip: number }; // price per selected unit (per unit name multiplier applied)
  costPerBase: number; // cost per base unit (kg)
  color?: string;
};

export type Sale = {
  id: string;
  itemId: string;
  date: string;
  unitName: string;
  unitMultiplier: number;
  quantity: number; // in selected unit
  baseQuantity: number; // quantity converted to base unit
  priceTier: PriceTier;
  unitPrice: number; // price per selected unit
  revenue: number;
  cost: number;
  profit: number;
};

export type Expense = {
  id: string;
  date: string;
  category: string;
  note?: string;
  amount: number;
};
