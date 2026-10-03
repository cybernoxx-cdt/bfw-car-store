"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getAvailableCars } from "@/lib/firestore/cars";
import { CarFilters, type CarFiltersState } from "@/components/cars/CarFilters";
import { CarGrid } from "@/components/cars/CarGrid";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { Car } from "@/types";

function CarsPageInner() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<Car[] | null>(null);
  const [filters, setFilters] = useState<CarFiltersState>({
    query: searchParams.get("q") ?? "",
    brand: "",
    category: "",
    maxPrice: 0,
    featuredOnly: false,
  });

  useEffect(() => {
    let mounted = true;
    getAvailableCars()
      .then((data) => {
        if (!mounted) return;
        setCars(data);
        const ceiling = Math.max(...data.map((c) => c.basePrice), 100000);
        setFilters((f) => ({ ...f, maxPrice: f.maxPrice || ceiling }));
      })
      .catch(() => mounted && setCars([]));
    return () => {
      mounted = false;
    };
  }, []);

  const priceCeiling = useMemo(
    () => (cars && cars.length ? Math.max(...cars.map((c) => c.basePrice)) : 100000),
    [cars]
  );

  const filtered = useMemo(() => {
    if (!cars) return [];
    const q = filters.query.trim().toLowerCase();
    return cars.filter((car) => {
      if (q) {
        const haystack = `${car.brand} ${car.model} ${car.name} ${car.category}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.brand && car.brand !== filters.brand) return false;
      if (filters.category && car.category !== filters.category) return false;
      if (filters.maxPrice && car.basePrice > filters.maxPrice) return false;
      if (filters.featuredOnly && !car.featured) return false;
      return true;
    });
  }, [cars, filters]);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pt-40">
      <SectionHeading label="Inventory" title="Available Vehicles" />

      <div className="mt-10">
        <CarFilters cars={cars ?? []} value={filters} onChange={setFilters} priceCeiling={priceCeiling} />
      </div>

      <div className="mt-10">
        <CarGrid cars={filtered} loading={cars === null} />
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={null}>
      <CarsPageInner />
    </Suspense>
  );
}
