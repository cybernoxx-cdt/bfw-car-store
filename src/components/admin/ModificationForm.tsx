"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import type { Modification, Car, Category } from "@/types";
import { getAllCars } from "@/lib/firestore/cars";
import { getAllCategories } from "@/lib/firestore/categories";
import { MediaUploader, MultiImageUploader } from "./MediaUploader";

export type ModificationFormValues = Omit<Modification, "id" | "createdAt" | "updatedAt">;

const EMPTY: ModificationFormValues = {
  carId: "",
  compatibility: [],
  categoryId: "",
  name: "",
  description: "",
  price: 0,
  currency: "USD",
  image: "",
  gallery: [],
  overlayImage: "",
  overlayTop: 0,
  overlayLeft: 0,
  overlayWidth: 100,
  available: true,
  featured: false,
};

interface ModificationFormProps {
  initial?: Modification;
  submitting: boolean;
  onSubmit: (values: ModificationFormValues) => void;
  submitLabel?: string;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest2 text-bone-dim">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-ink-900 px-3.5 py-2.5 text-sm text-bone placeholder:text-bone-dim/60 focus:border-ignition focus:outline-none";

export function ModificationForm({ initial, submitting, onSubmit, submitLabel = "Save Modification" }: ModificationFormProps) {
  const [values, setValues] = useState<ModificationFormValues>(() => (initial ? { ...EMPTY, ...initial } : EMPTY));
  const [cars, setCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getAllCars().then(setCars);
    getAllCategories().then(setCategories);
  }, []);

  const set = <K extends keyof ModificationFormValues>(key: K, val: ModificationFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: val }));

  const toggleCompatible = (carId: string) => {
    setValues((v) => {
      const has = v.compatibility.includes(carId);
      return { ...v, compatibility: has ? v.compatibility.filter((id) => id !== carId) : [...v.compatibility, carId] };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
        <h3 className="mb-5 font-display text-lg font-bold uppercase text-bone">Details</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name">
            <input required className={inputClass} value={values.name} onChange={(e) => set("name", e.target.value)} placeholder="Carbon Fiber Spoiler" />
          </Field>
          <Field label="Primary Car">
            <select required className={inputClass} value={values.carId} onChange={(e) => set("carId", e.target.value)}>
              <option value="">Select a car…</option>
              {cars.map((c) => (
                <option key={c.id} value={c.id}>{c.brand} {c.model}</option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select required className={inputClass} value={values.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
              <option value="">Select a category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Price">
            <input type="number" required className={inputClass} value={values.price} onChange={(e) => set("price", Number(e.target.value))} />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Description">
            <textarea rows={3} className={inputClass} value={values.description} onChange={(e) => set("description", e.target.value)} />
          </Field>
        </div>
        <div className="mt-5 flex gap-6">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest2 text-bone-dim">
            <input type="checkbox" checked={values.available} onChange={(e) => set("available", e.target.checked)} className="h-4 w-4 accent-ignition" />
            Available
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest2 text-bone-dim">
            <input type="checkbox" checked={values.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-ignition" />
            Featured
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
        <h3 className="mb-2 font-display text-lg font-bold uppercase text-bone">Compatibility</h3>
        <p className="mb-4 text-xs text-bone-dim">Also fits these additional vehicles (beyond the primary car above).</p>
        <div className="flex flex-wrap gap-2">
          {cars
            .filter((c) => c.id !== values.carId)
            .map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => toggleCompatible(c.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  values.compatibility.includes(c.id) ? "border-ignition bg-ignition/10 text-ignition" : "border-white/15 text-bone-dim hover:text-bone"
                }`}
              >
                {c.brand} {c.model}
              </button>
            ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
        <h3 className="mb-5 font-display text-lg font-bold uppercase text-bone">Media</h3>
        <div className="space-y-6">
          <MediaUploader label="Main Image" folder="modifications" value={values.image} onChange={(url) => set("image", url)} />
          <MultiImageUploader label="Gallery" folder="modifications" value={values.gallery ?? []} onChange={(urls) => set("gallery", urls)} />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
        <h3 className="mb-2 font-display text-lg font-bold uppercase text-bone">Visual Configurator (Optional)</h3>
        <p className="mb-5 text-xs text-bone-dim">
          Upload a transparent PNG/WebP cutout to layer this part on top of the car photo in the visual configurator.
          Leave empty to show this part as a card only.
        </p>
        <MediaUploader label="Transparent Overlay Image" folder="modifications/overlays" value={values.overlayImage ?? ""} onChange={(url) => set("overlayImage", url)} />
        <div className="mt-5 grid grid-cols-3 gap-4">
          <Field label="Top Offset %">
            <input type="number" className={inputClass} value={values.overlayTop ?? 0} onChange={(e) => set("overlayTop", Number(e.target.value))} />
          </Field>
          <Field label="Left Offset %">
            <input type="number" className={inputClass} value={values.overlayLeft ?? 0} onChange={(e) => set("overlayLeft", Number(e.target.value))} />
          </Field>
          <Field label="Width %">
            <input type="number" className={inputClass} value={values.overlayWidth ?? 100} onChange={(e) => set("overlayWidth", Number(e.target.value))} />
          </Field>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-lg bg-ignition px-6 py-3 text-xs font-semibold uppercase tracking-widest2 text-ink-900 transition-colors hover:bg-ignition-soft disabled:opacity-60"
      >
        {submitting && <Loader2 size={14} className="animate-spin" />}
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
