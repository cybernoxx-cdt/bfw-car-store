"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Gauge } from "lucide-react";
import type { Car } from "@/types";
import { cldResponsive } from "@/lib/cloudinary";
import { formatMoney } from "@/lib/whatsapp";
import { fadeUp } from "@/lib/animations";

export function CarCard({ car, priority = false }: { car: Car; priority?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const revealed = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !revealed.current) {
          revealed.current = true;
          fadeUp(el, { duration: 0.7 });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="opacity-0">
      <Link
        href={`/cars/${car.id}`}
        className="group block overflow-hidden rounded-2xl border border-white/10 bg-ink-700 transition-colors hover:border-ignition/40"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-ink-600">
          {car.heroImage ? (
            <Image
              src={cldResponsive(car.heroImage, 900)}
              alt={car.name}
              fill
              priority={priority}
              className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-bone-dim">
              <Gauge size={28} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {car.category && (
            <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest2 text-bone backdrop-blur-md">
              {car.category}
            </span>
          )}
          {!car.available && (
            <span className="absolute right-4 top-4 rounded-full bg-signal-stop/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest2 text-white">
              Sold
            </span>
          )}
          <div className="absolute bottom-4 right-4 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-ignition text-ink-900 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={16} />
          </div>
        </div>

        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-widest2 text-bone-dim">
            {car.brand} · {car.year}
          </p>
          <h3 className="mt-1 font-display text-2xl font-bold uppercase leading-tight text-bone">
            {car.model || car.name}
          </h3>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="font-display text-lg font-semibold text-ignition">
              {formatMoney(car.basePrice, car.currency)}
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest2 text-bone-dim transition-colors group-hover:text-bone">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
