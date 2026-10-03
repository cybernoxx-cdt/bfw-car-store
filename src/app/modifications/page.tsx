import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { getAllModifications } from "@/lib/firestore/modifications";
import { getAllCategories } from "@/lib/firestore/categories";
import { getAllCars } from "@/lib/firestore/cars";
import { cldResponsive } from "@/lib/cloudinary";
import { formatMoney } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = {
  title: "Modifications",
  description: "Browse every modification category we offer, from exterior styling to full performance builds.",
};

export default async function ModificationsPage() {
  const [mods, categories, cars] = await Promise.all([getAllModifications(), getAllCategories(), getAllCars()]);

  const carNameById = new Map(cars.map((c) => [c.id, `${c.brand} ${c.model}`.trim()]));
  const available = mods.filter((m) => m.available);

  const grouped = categories
    .map((cat) => ({ category: cat, items: available.filter((m) => m.categoryId === cat.id) }))
    .filter((g) => g.items.length > 0);

  const uncategorized = available.filter((m) => !categories.some((c) => c.id === m.categoryId));

  return (
    <div className="mx-auto max-w-7xl px-6 pb-28 pt-32 sm:pt-40">
      <SectionHeading
        label="What We Build"
        title="Modifications"
        description="Every part below is tied to a specific vehicle in our collection — pick a category, then jump into that car's configurator to add it to your build."
      />

      {available.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            icon={Wrench}
            title="No modifications available yet."
            description="Check back soon — new parts are added regularly."
          />
        </div>
      ) : (
        <div className="mt-14 space-y-16">
          {[...grouped, ...(uncategorized.length ? [{ category: { id: "other", name: "Other", order: 999 }, items: uncategorized }] : [])].map(
            ({ category, items }) => (
              <div key={category.id}>
                <h2 className="font-display text-2xl font-bold uppercase text-bone">{category.name}</h2>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((mod) => (
                    <Link
                      key={mod.id}
                      href={`/cars/${mod.carId}#build`}
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-ink-700/50 transition-colors hover:border-ignition/40"
                    >
                      <div className="relative aspect-[4/3] bg-ink-600">
                        {mod.image && (
                          <Image
                            src={cldResponsive(mod.image, 600)}
                            alt={mod.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-lg font-semibold uppercase text-bone">{mod.name}</h3>
                        <p className="mt-1 text-xs text-bone-dim">
                          Fits {carNameById.get(mod.carId) ?? "select vehicles"}
                        </p>
                        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                          <span className="font-display text-base font-semibold text-ignition">
                            {formatMoney(mod.price, mod.currency)}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest2 text-bone-dim group-hover:text-bone">
                            Build <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
