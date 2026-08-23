import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { InventoryItem, Sale, Expense, PriceTier, UnitDefinition } from "../types";
import { v4 as uuid } from "uuid";
import { toCSV, parseCSV, serializeUnits, deserializeUnits } from "../utils/csv";

/* initial data (same as before) */
const initialItems: InventoryItem[] = [
  {
    id: "item-parboiled-rice",
    name: "Parboiled Rice",
    category: "Rice",
    baseUnit: "kg",
    baseQuantity: 240,
    units: [
      { id: "u-bag", name: "Bag (24 kg)", multiplier: 24 },
      { id: "u-half-bag", name: "Half-Bag (12 kg)", multiplier: 12 },
      { id: "u-kg", name: "kg", multiplier: 1 },
    ],
    price: { retail: 1.5 * 24, wholesale: 1.2 * 24, vip: 1.0 * 24 },
    costPerBase: 1.0,
    color: "#F59E0B",
  },
  {
    id: "item-long-grain-rice",
    name: "Long Grain Rice",
    category: "Rice",
    baseUnit: "kg",
    baseQuantity: 120,
    units: [
      { id: "u-bag", name: "Bag (24 kg)", multiplier: 24 },
      { id: "u-kg", name: "kg", multiplier: 1 },
    ],
    price: { retail: 1.6 * 24, wholesale: 1.3 * 24, vip: 1.05 * 24 },
    costPerBase: 1.05,
    color: "#60A5FA",
  },
];

const initialSales: Sale[] = [
  {
    id: uuid(),
    itemId: "item-parboiled-rice",
    date: new Date().toISOString(),
    unitName: "Bag (24 kg)",
    unitMultiplier: 24,
    quantity: 1,
    baseQuantity: 24,
    priceTier: "retail",
    unitPrice: 36,
    revenue: 36,
    cost: 24 * 1.0,
    profit: 12,
  },
];

const initialExpenses: Expense[] = [
  {
    id: uuid(),
    date: new Date().toISOString(),
    category: "Logistics",
    note: "Delivery to city warehouse",
    amount: 120,
  },
];

type Store = {
  items: InventoryItem[];
  sales: Sale[];
  expenses: Expense[];
};

export function useInventoryStore() {
  const [state, setState] = useLocalStorage<Store>("stockpulse:v1", {
    items: initialItems,
    sales: initialSales,
    expenses: initialExpenses,
  });

  const findItem = useCallback((itemId: string) => state.items.find((i) => i.id === itemId), [state.items]);

  const convertToBase = useCallback((qty: number, multiplier: number) => qty * multiplier, []);
  const convertFromBase = useCallback((baseQty: number, multiplier: number) => baseQty / multiplier, []);

  const adjustStock = useCallback((itemId: string, unitMultiplier: number, deltaUnits: number) => {
    setState((s) => {
      const items = s.items.map((it) => {
        if (it.id !== itemId) return it;
        const baseDelta = deltaUnits * unitMultiplier;
        return { ...it, baseQuantity: Math.max(0, it.baseQuantity + baseDelta) };
      });
      return { ...s, items };
    });
  }, [setState]);

  const addUnitToItem = useCallback((itemId: string, unit: { name: string; multiplier: number }) => {
    setState((s) => {
      const items = s.items.map((it) => {
        if (it.id !== itemId) return it;
        // prevent duplicate names
        if (it.units.some((u) => u.name.toLowerCase() === unit.name.toLowerCase())) return it;
        const newUnit: UnitDefinition = { id: uuid(), name: unit.name, multiplier: unit.multiplier };
        return { ...it, units: [...it.units, newUnit] };
      });
      return { ...s, items };
    });
  }, [setState]);

  const addSale = useCallback(
    (payload: { itemId: string; unitName: string; unitMultiplier: number; quantity: number; priceTier: PriceTier }) => {
      setState((s) => {
        const item = s.items.find((x) => x.id === payload.itemId);
        if (!item) return s;
        const baseQty = payload.quantity * payload.unitMultiplier;
        const unitPrice = item.price[payload.priceTier];
        const revenue = unitPrice * payload.quantity;
        const cost = baseQty * item.costPerBase;
        const profit = revenue - cost;
        const sale: Sale = {
          id: uuid(),
          itemId: payload.itemId,
          date: new Date().toISOString(),
          unitName: payload.unitName,
          unitMultiplier: payload.unitMultiplier,
          quantity: payload.quantity,
          baseQuantity: baseQty,
          priceTier: payload.priceTier,
          unitPrice,
          revenue,
          cost,
          profit,
        };
        const items = s.items.map((it) => (it.id === payload.itemId ? { ...it, baseQuantity: Math.max(0, it.baseQuantity - baseQty) } : it));
        return { ...s, items, sales: [sale, ...s.sales] };
      });
    },
    [setState]
  );

  const addExpense = useCallback(
    (expense: { category: string; note?: string; amount: number }) => {
      setState((s) => {
        const newExpense = {
          id: uuid(),
          date: new Date().toISOString(),
          category: expense.category,
          note: expense.note,
          amount: expense.amount,
        };
        return { ...s, expenses: [newExpense, ...s.expenses] };
      });
    },
    [setState]
  );

  /* CSV export helpers */
  const exportInventoryCSV = useCallback(() => {
    const rows = state.items.map((it) => ({
      id: it.id,
      name: it.name,
      category: it.category,
      baseUnit: it.baseUnit,
      baseQuantity: it.baseQuantity,
      units: serializeUnits(it.units.map((u) => ({ name: u.name, multiplier: u.multiplier }))),
      price_retail: it.price.retail,
      price_wholesale: it.price.wholesale,
      price_vip: it.price.vip,
      costPerBase: it.costPerBase,
      color: it.color ?? "",
    }));
    return toCSV(rows);
  }, [state.items]);

  const exportSalesCSV = useCallback(() => {
    const rows = state.sales.map((s) => ({
      id: s.id,
      date: s.date,
      itemId: s.itemId,
      unitName: s.unitName,
      unitMultiplier: s.unitMultiplier,
      quantity: s.quantity,
      baseQuantity: s.baseQuantity,
      priceTier: s.priceTier,
      unitPrice: s.unitPrice,
      revenue: s.revenue,
      cost: s.cost,
      profit: s.profit,
    }));
    return toCSV(rows);
  }, [state.sales]);

  const exportExpensesCSV = useCallback(() => {
    const rows = state.expenses.map((e) => ({
      id: e.id,
      date: e.date,
      category: e.category,
      note: e.note ?? "",
      amount: e.amount,
    }));
    return toCSV(rows);
  }, [state.expenses]);

  /* CSV import helpers — supports merge or replace */
  const importInventoryCSV = useCallback(
    (csv: string, replace = false) => {
      try {
        const parsed = parseCSV(csv);
        const items = parsed.map((r) => {
          const units = deserializeUnits(r.units ?? "");
          const item: InventoryItem = {
            id: r.id && r.id.trim() ? r.id : uuid(),
            name: r.name ?? "Untitled",
            category: r.category ?? "Uncategorized",
            baseUnit: r.baseUnit ?? "unit",
            baseQuantity: Number(r.baseQuantity) || 0,
            units: units.map((u, i) => ({ id: `${uuid()}-${i}`, name: u.name, multiplier: Number(u.multiplier) || 1 })),
            price: { retail: Number(r.price_retail) || 0, wholesale: Number(r.price_wholesale) || 0, vip: Number(r.price_vip) || 0 },
            costPerBase: Number(r.costPerBase) || 0,
            color: r.color ?? "",
          };
          return item;
        });
        setState((s) => {
          const merged = replace ? items : [...items, ...s.items];
          return { ...s, items: merged };
        });
        return { ok: true, imported: items.length };
      } catch (err) {
        return { ok: false, error: String(err) };
      }
    },
    [setState]
  );

  const importSalesCSV = useCallback(
    (csv: string, replace = false) => {
      try {
        const parsed = parseCSV(csv);
        const rows = parsed.map((r) => ({
          id: r.id && r.id.trim() ? r.id : uuid(),
          itemId: r.itemId,
          date: r.date || new Date().toISOString(),
          unitName: r.unitName,
          unitMultiplier: Number(r.unitMultiplier) || 1,
          quantity: Number(r.quantity) || 0,
          baseQuantity: Number(r.baseQuantity) || 0,
          priceTier: (r.priceTier as PriceTier) || "retail",
          unitPrice: Number(r.unitPrice) || 0,
          revenue: Number(r.revenue) || 0,
          cost: Number(r.cost) || 0,
          profit: Number(r.profit) || 0,
        })) as Sale[];
        setState((s) => ({ ...s, sales: replace ? rows : [...rows, ...s.sales] }));
        return { ok: true, imported: rows.length };
      } catch (err) {
        return { ok: false, error: String(err) };
      }
    },
    [setState]
  );

  const importExpensesCSV = useCallback(
    (csv: string, replace = false) => {
      try {
        const parsed = parseCSV(csv);
        const rows = parsed.map((r) => ({
          id: r.id && r.id.trim() ? r.id : uuid(),
          date: r.date || new Date().toISOString(),
          category: r.category ?? "Other",
          note: r.note ?? "",
          amount: Number(r.amount) || 0,
        })) as Expense[];
        setState((s) => ({ ...s, expenses: replace ? rows : [...rows, ...s.expenses] }));
        return { ok: true, imported: rows.length };
      } catch (err) {
        return { ok: false, error: String(err) };
      }
    },
    [setState]
  );

  const metrics = {
    totalRevenue: state.sales.reduce((acc, s) => acc + s.revenue, 0),
    totalExpenses: state.expenses.reduce((acc, e) => acc + e.amount, 0),
    netProfit: state.sales.reduce((acc, s) => acc + s.profit, 0) - state.expenses.reduce((acc, e) => acc + e.amount, 0),
    ROI: (() => {
      const investment = state.expenses.reduce((acc, e) => acc + e.amount, 0);
      const profit = state.sales.reduce((acc, s) => acc + s.profit, 0);
      return investment === 0 ? 0 : (profit / investment) * 100;
    })(),
  };

  return {
    items: state.items,
    sales: state.sales,
    expenses: state.expenses,
    findItem,
    convertToBase,
    convertFromBase,
    adjustStock,
    addSale,
    addExpense,
    addUnitToItem,
    exportInventoryCSV,
    exportSalesCSV,
    exportExpensesCSV,
    importInventoryCSV,
    importSalesCSV,
    importExpensesCSV,
    metrics,
  };
}
