import React from "react";
import { motion } from "motion/react";
import { Home, Box, DollarSign, FileText, ChevronsLeft, ChevronsRight, SunMoon } from "lucide-react";

type Props = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  active: number;
  setActive: (i: number) => void;
  onToggleTheme: () => void;
};

export default function Sidebar({ collapsed, setCollapsed, active, setActive, onToggleTheme }: Props) {
  const nav = [
    { id: 0, label: "Dashboard", icon: <Home size={18} /> },
    { id: 1, label: "Inventory", icon: <Box size={18} /> },
    { id: 2, label: "Sales", icon: <DollarSign size={18} /> },
    { id: 3, label: "Expenses", icon: <FileText size={18} /> },
  ];

  return (
    <motion.aside
      initial={{ width: collapsed ? 72 : 260 }}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="h-screen flex flex-col glass p-3"
      style={{ overflow: "hidden" }}
    >
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center text-white font-bold">
          SP
        </div>
        {!collapsed && (
          <div>
            <div className="text-lg font-semibold">StockPulse</div>
            <div className="text-sm text-zinc-400">Inventory & Finance</div>
          </div>
        )}
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {nav.map((n) => {
            const isActive = active === n.id;
            return (
              <li key={n.id}>
                <button
                  onClick={() => setActive(n.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    isActive ? "bg-white/6 text-white" : "text-zinc-300 hover:bg-white/2"
                  }`}
                >
                  <span className="opacity-95">{n.icon}</span>
                  {!collapsed && <span className="font-medium">{n.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-4 px-2">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl hover:bg-white/2 transition"
            aria-label="toggle sidebar"
          >
            {collapsed ? <ChevronsRight /> : <ChevronsLeft />}
          </button>
          <div className="flex-1"></div>
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl hover:bg-white/2 transition flex items-center gap-2"
            aria-label="toggle theme"
            title="Toggle dark/light"
          >
            <SunMoon />
            {!collapsed && <span className="text-sm">Theme</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
