import React from "react";
import { Search } from "lucide-react";

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold">Inventory & Financial Dashboard</h1>
        <div className="text-sm text-zinc-400">Real-time overview & accounting</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-white/3 glass p-2 rounded-lg">
          <Search className="text-zinc-300" />
          <input
            className="bg-transparent outline-none placeholder:text-zinc-400 w-48"
            placeholder="Search inventory, sales..."
          />
        </div>
        {children}
      </div>
    </header>
  );
}
