import type { Car } from "@/types";
import { CarCard } from "./CarCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { CarCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Gauge } from "lucide-react";

interface CarGridProps {
  cars: Car[];
  loading?: boolean;
}

export function CarGrid({ cars, loading }: CarGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CarCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <EmptyState
        icon={Gauge}
        title="No vehicles match your filters"
        description="Try adjusting your search, or check back soon — new vehicles are added regularly."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car, i) => (
        <CarCard key={car.id} car={car} priority={i < 3} />
      ))}
    </div>
  );
}
