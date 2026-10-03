"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "swiper/css";

import { getFeaturedCars } from "@/lib/firestore/cars";
import { CarCard } from "@/components/cars/CarCard";
import { CarCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { Car } from "@/types";

export function FeaturedVehicles() {
  const [cars, setCars] = useState<Car[] | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    let mounted = true;
    getFeaturedCars(8)
      .then((data) => mounted && setCars(data))
      .catch(() => mounted && setCars([]));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="bg-ink-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading label="The Collection" title="Featured Vehicles" />
          <div className="flex items-center gap-3">
            <Link
              href="/cars"
              className="hidden text-xs font-semibold uppercase tracking-widest2 text-bone-dim transition-colors hover:text-ignition sm:block"
            >
              View All Cars
            </Link>
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone transition-colors hover:border-ignition hover:text-ignition"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone transition-colors hover:border-ignition hover:text-ignition"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {cars === null ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <CarCardSkeleton key={i} />)}
          </div>
        ) : cars.length === 0 ? (
          <p className="text-sm text-bone-dim">Featured vehicles will appear here once they're added in the admin panel.</p>
        ) : (
          <Swiper
            modules={[Navigation]}
            onSwiper={(s) => (swiperRef.current = s)}
            spaceBetween={24}
            slidesPerView={1.1}
            breakpoints={{
              640: { slidesPerView: 2.1 },
              1024: { slidesPerView: 3.2 },
            }}
          >
            {cars.map((car, i) => (
              <SwiperSlide key={car.id}>
                <CarCard car={car} priority={i < 2} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
