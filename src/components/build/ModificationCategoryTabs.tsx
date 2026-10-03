"use client";

import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface ModificationCategoryTabsProps {
  categories: Category[];
  active: string;
  onChange: (id: string) => void;
  counts: Record<string, number>;
}

export function ModificationCategoryTabs({ categories, active, onChange, counts }: ModificationCategoryTabsProps) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <div className="scrollbar-none -mx-6 flex gap-2 overflow-x-auto px-6 pb-2">
      <button
        onClick={() => onChange("all")}
        className={cn(
          "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest2 transition-colors",
          active === "all" ? "border-ignition bg-ignition text-ink-900" : "border-white/15 text-bone-dim hover:text-bone"
        )}
      >
        All ({total})
      </button>
      {categories.map((cat) => {
        const count = counts[cat.id] ?? 0;
        if (count === 0) return null;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest2 transition-colors",
              active === cat.id ? "border-ignition bg-ignition text-ink-900" : "border-white/15 text-bone-dim hover:text-bone"
            )}
          >
            {cat.name} ({count})
          </button>
        );
      })}
    </div>
  );
}
