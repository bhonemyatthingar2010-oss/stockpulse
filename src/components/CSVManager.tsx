import React, { useRef, useState } from "react";
import { useInventoryStore } from "../hooks/useInventoryStore";
import { Download, UploadCloud } from "lucide-react";
import { motion } from "motion/react";

export default function CSVManager() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const {
    exportInventoryCSV,
    exportSalesCSV,
    exportExpensesCSV,
    importInventoryCSV,
    importSalesCSV,
    importExpensesCSV,
  } = useInventoryStore();
  const [status, setStatus] = useState<string | null>(null);

  const download = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = (type: "inventory" | "sales" | "expenses") => {
    if (type === "inventory") download(exportInventoryCSV(), "inventory.csv");
    if (type === "sales") download(exportSalesCSV(), "sales.csv");
    if (type === "expenses") download(exportExpensesCSV(), "expenses.csv");
    setStatus(`Exported ${type}`);
    setTimeout(() => setStatus(null), 2500);
  };

  const handleImportClick = (type: "inventory" | "sales" | "expenses") => {
    fileRef.current!.dataset.type = type;
    fileRef.current!.click();
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const type = (e.target as HTMLInputElement).dataset.type as "inventory" | "sales" | "expenses";
    const text = await f.text();
    setStatus("Importing...");
    try {
      let res;
      if (type === "inventory") res = importInventoryCSV(text, false);
      if (type === "sales") res = importSalesCSV(text, false);
      if (type === "expenses") res = importExpensesCSV(text, false);
      setStatus(res.ok ? `Imported ${res.imported} ${type}` : `Error: ${res.error}`);
    } catch (err: any) {
      setStatus(`Error: ${String(err)}`);
    }
    setTimeout(() => setStatus(null), 3000);
    e.currentTarget.value = "";
  };

  return (
    <div className="flex items-center gap-3">
      <input ref={fileRef} data-type="inventory" type="file" accept=".csv,text/csv" className="hidden" onChange={onFile} />
      <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-2">
        <div className="hidden md:flex gap-2">
          <button onClick={() => handleExport("inventory")} className="px-3 py-2 rounded-lg bg-white/3 glass flex items-center gap-2">
            <Download size={16} /> Inventory
          </button>
          <button onClick={() => handleExport("sales")} className="px-3 py-2 rounded-lg bg-white/3 glass flex items-center gap-2">
            <Download size={16} /> Sales
          </button>
          <button onClick={() => handleExport("expenses")} className="px-3 py-2 rounded-lg bg-white/3 glass flex items-center gap-2">
            <Download size={16} /> Expenses
          </button>
        </div>

        <div className="relative">
          <button onClick={() => handleImportClick("inventory")} className="px-3 py-2 rounded-lg bg-white/4 glass flex items-center gap-2">
            <UploadCloud size={16} /> Import
          </button>
          <div className="absolute -right-0 top-full mt-2 p-3 glass rounded-lg shadow-lg hidden md:block">
            <div className="text-sm text-zinc-300">Import CSV for Inventory / Sales / Expenses</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleImportClick("inventory")} className="px-2 py-1 rounded bg-white/4">Inventory</button>
              <button onClick={() => handleImportClick("sales")} className="px-2 py-1 rounded bg-white/4">Sales</button>
              <button onClick={() => handleImportClick("expenses")} className="px-2 py-1 rounded bg-white/4">Expenses</button>
            </div>
            <div className="text-xs text-zinc-500 mt-2">Files will be merged by default (not replaced).</div>
          </div>

        {status && <div className="text-sm text-zinc-300">{status}</div>}
      </motion.div>
    </div>
  );
}
