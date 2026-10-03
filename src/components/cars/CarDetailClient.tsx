"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Wrench } from "lucide-react";
import type { Car, Category, Modification, SelectedModSnapshot } from "@/types";
import { cldResponsive } from "@/lib/cloudinary";
import { formatMoney, buildWhatsAppMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { createLead } from "@/lib/firestore/leads";
import { fadeUp } from "@/lib/animations";
import { useToast } from "@/hooks/useToast";
import { CarGallery } from "./CarGallery";
import { CarSpecs } from "./CarSpecs";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { ModificationCategoryTabs } from "@/components/build/ModificationCategoryTabs";
import { ModificationCard } from "@/components/build/ModificationCard";
import { ModificationModal } from "@/components/build/ModificationModal";
import { VisualConfigurator } from "@/components/build/VisualConfigurator";
import { BuildSummary } from "@/components/build/BuildSummary";

interface CarDetailClientProps {
  car: Car;
  modifications: Modification[];
  categories: Category[];
  whatsappNumber: string;
}

export function CarDetailClient({ car, modifications, categories, whatsappNumber }: CarDetailClientProps) {
  const [selected, setSelected] = useState<Record<string, Modification>>({});
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalMod, setModalMod] = useState<Modification | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { push } = useToast();

  useEffect(() => {
    if (heroRef.current) fadeUp(heroRef.current);
  }, []);

  const carName = `${car.brand} ${car.model}`.trim();
  const selectedList = useMemo(() => Object.values(selected), [selected]);
  const layeredMods = useMemo(() => selectedList.filter((m) => m.overlayImage), [selectedList]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    modifications.forEach((m) => {
      map[m.categoryId] = (map[m.categoryId] ?? 0) + 1;
    });
    return map;
  }, [modifications]);

  const filteredMods =
    activeCategory === "all" ? modifications : modifications.filter((m) => m.categoryId === activeCategory);

  const toggle = (mod: Modification) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[mod.id]) delete next[mod.id];
      else next[mod.id] = mod;
      return next;
    });
  };

  const remove = (id: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const clear = () => setSelected({});

  const handleBuy = async () => {
    setSubmitting(true);
    const snapshot: SelectedModSnapshot[] = selectedList.map((m) => ({
      id: m.id,
      name: m.name,
      price: m.price,
      categoryId: m.categoryId,
    }));
    const total = car.basePrice + selectedList.reduce((sum, m) => sum + m.price, 0);

    try {
      await createLead({
        carId: car.id,
        carName,
        selectedModifications: snapshot,
        totalPrice: total,
        currency: car.currency,
      });

      if (!whatsappNumber) {
        push("Thanks! Your build was saved — we don't have a WhatsApp number configured yet, so please reach out directly.", "info");
        return;
      }

      const message = buildWhatsAppMessage({
        carName,
        basePrice: car.basePrice,
        currency: car.currency,
        mods: snapshot,
        total,
      });
      window.open(buildWhatsAppLink(whatsappNumber, message), "_blank", "noopener,noreferrer");
      push("Your build was saved. Opening WhatsApp…", "success");
    } catch {
      push("Something went wrong sending your build. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero image */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-ink-800 sm:h-[70vh]">
        {car.heroImage && (
          <Image src={cldResponsive(car.heroImage, 1920)} alt={carName} fill priority className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
        <div ref={heroRef} className="absolute inset-x-0 bottom-0 px-6 pb-10 opacity-0">
          <div className="mx-auto max-w-7xl">
            {!car.available && (
              <span className="mb-3 inline-block rounded-full bg-signal-stop px-3 py-1 text-[10px] font-semibold uppercase tracking-widest2 text-white">
                Sold
              </span>
            )}
            <p className="text-xs font-semibold uppercase tracking-widest2 text-ignition">
              {car.brand} · {car.year} · {car.category}
            </p>
            <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-[0.95] text-bone sm:text-6xl md:text-7xl">
              {car.model || car.name}
            </h1>
            <p className="mt-4 font-display text-2xl font-semibold text-bone">
              {formatMoney(car.basePrice, car.currency)}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Gallery + description */}
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CarGallery images={car.galleryImages} alt={carName} />
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-bone-dim">{car.description}</p>
          </div>
          <div className="lg:col-span-1">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-bone-dim">Specifications</p>
          </div>
        </div>

        <div className="mt-4">
          <CarSpecs specs={car.specifications} />
        </div>

        {/* Build Your Car */}
        <div id="build" className="mt-24 scroll-mt-28">
          <SectionHeading label="Configurator" title="Build Your Car" />

          {modifications.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                icon={Wrench}
                title="No modifications available for this vehicle."
                description="Check back soon, or contact us directly to discuss a custom build."
              />
            </div>
          ) : (
            <div className="mt-10 grid gap-10 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                {layeredMods.length > 0 && (
                  <VisualConfigurator baseImage={car.heroImage} altText={carName} layeredMods={layeredMods} />
                )}

                <ModificationCategoryTabs
                  categories={categories}
                  active={activeCategory}
                  onChange={setActiveCategory}
                  counts={counts}
                />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredMods.map((mod) => (
                    <ModificationCard
                      key={mod.id}
                      mod={mod}
                      selected={Boolean(selected[mod.id])}
                      onToggle={() => toggle(mod)}
                      onViewDetail={() => setModalMod(mod)}
                    />
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <BuildSummary
                  carName={carName}
                  basePrice={car.basePrice}
                  currency={car.currency}
                  selectedMods={selectedList}
                  onRemove={remove}
                  onClear={clear}
                  onBuy={handleBuy}
                  submitting={submitting}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spacer so the fixed mobile summary bar never covers content */}
      <div className="h-24 lg:hidden" />

      <ModificationModal
        mod={modalMod}
        carName={carName}
        selected={modalMod ? Boolean(selected[modalMod.id]) : false}
        onToggle={() => modalMod && toggle(modalMod)}
        onClose={() => setModalMod(null)}
      />
    </div>
  );
}
