"use client";

import { useMemo } from "react";
import { Search } from "lucide-react";
import type { Car } from "@/types";

export interface CarFiltersState {
  query: string;
  brand: string;
  category: string;
  maxPrice: number;
  featuredOnly: boolean;
}

interface CarFiltersProps {
  cars: Car[];
  value: CarFiltersState;
  onChange: (next: CarFiltersState) => void;
  priceCeiling: number;
}

export function CarFilters({ cars, value, onChange, priceCeiling }: CarFiltersProps) {
  const brands = useMemo(() => Array.from(new Set(cars.map((c) => c.brand).filter(Boolean))).sort(), [cars]);
  const categories = useMemo(() => Array.from(new Set(cars.map((c) => c.category).filter(Boolean))).sort(), [cars]);

  const set = <K extends keyof CarFiltersState>(key: K, val: CarFiltersState[K]) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-ink-700/60 p-5 backdrop-blur-md lg:flex-row lg:items-center lg:gap-6">
      <div className="relative flex-1">
        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bone-dim" />
        <input
          value={value.query}
          onChange={(e) => set("query", e.target.value)}
          placeholder="Search brand, model…"
          className="w-full rounded-full border border-white/10 bg-ink-900/60 py-2.5 pl-11 pr-4 text-sm text-bone placeholder:text-bone-dim focus:border-ignition focus:outline-none"
        />
      </div>

      <select
        value={value.brand}
        onChange={(e) => set("brand", e.target.value)}
        className="rounded-full border border-white/10 bg-ink-900/60 px-4 py-2.5 text-sm text-bone focus:border-ignition focus:outline-none"
      >
        <option value="">All Brands</option>
        {brands.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      <select
        value={value.category}
        onChange={(e) => set("category", e.target.value)}
        className="rounded-full border border-white/10 bg-ink-900/60 px-4 py-2.5 text-sm text-bone focus:border-ignition focus:outline-none"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <div className="flex min-w-[180px] items-center gap-3">
        <label htmlFor="maxPrice" className="whitespace-nowrap text-xs uppercase tracking-widest2 text-bone-dim">
          Up to ${Math.round(value.maxPrice).toLocaleString()}
        </label>
        <input
          id="maxPrice"
          type="range"
          min={0}
          max={priceCeiling || 100000}
          step={1000}
          value={value.maxPrice}
          onChange={(e) => set("maxPrice", Number(e.target.value))}
          className="w-full accent-ignition"
        />
      </div>

      <label className="flex items-center gap-2 whitespace-nowrap text-xs uppercase tracking-widest2 text-bone-dim">
        <input
          type="checkbox"
          checked={value.featuredOnly}
          onChange={(e) => set("featuredOnly", e.target.checked)}
          className="h-4 w-4 accent-ignition"
        />
        Featured only
      </label>
    </div>
  );
}
