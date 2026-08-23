# PR: feat(ui): animated inventory & financial dashboard + CSV import/export, optimistic preview, unit editor

This PR adds a production-ready Inventory & Financial Dashboard UI built with React 19, Tailwind CSS, motion/react, lucide-react, and Recharts. It focuses on premium UI/UX, advanced inventory handling with multi-unit support, optimistic sales preview, CSV import/export, and deployment-ready build configs.

Features
- Modern SaaS UI with glassmorphism, soft glows, consistent spacing, and dark/light mode persisted to localStorage.
- Animated interactions: sidebar spring animation, tab transitions with AnimatePresence, hover/tap scale feedback, and staggered row animations.
- Inventory
  - Multi-unit support with conversion multipliers (e.g., Bag = 24 kg, Half-Bag = 12 kg).
  - Inline stock adjuster that converts units to base and updates stock.
  - Unit manager modal to create custom units with validation.
- Sales
  - Optimistic live preview of revenue, cost, profit, and base-qty conversion while composing a sale.
  - Selling deducts converted base units from inventory and logs the sale.
- Expenses
  - Add, list, and persist operational expenses.
- CSV import/export for Inventory, Sales, and Expenses (merge by default).
- Persistence via localStorage and a modular hook-based store (useInventoryStore).
- Vite + Tailwind + PostCSS configs and package.json scripts for easy deployment.

Files added/updated
- src/ (components, hooks, tabs) — UI and logic
- src/utils/csv.ts — lightweight CSV parser/serializer
- tailwind.config.cjs, postcss.config.cjs, package.json

Testing notes
- Run `npm ci && npm run dev` to run locally.
- Use CSV import/export from the header to backup/restore data.
- Open the Unit Manager from Inventory to create custom units and test conversions.

Vercel deployment
- Recommended settings:
  - Install command: `npm ci`
  - Build command: `npm run build`
  - Output directory: `dist`

If you want any adjustments (PR body edits, squashing commits, adding tests), tell me and I’ll update the PR.
