"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import type { Car } from "@/types";
import { MediaUploader, MultiImageUploader } from "./MediaUploader";

export type CarFormValues = Omit<Car, "id" | "createdAt" | "updatedAt">;

const EMPTY: CarFormValues = {
  name: "",
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  category: "",
  basePrice: 0,
  currency: "USD",
  description: "",
  specifications: {
    engine: "",
    power: "",
    torque: "",
    transmission: "",
    drive: "",
    topSpeed: "",
    zeroToHundred: "",
  },
  heroImage: "",
  galleryImages: [],
  featured: false,
  available: true,
};

interface CarFormProps {
  initial?: Car;
  submitting: boolean;
  onSubmit: (values: CarFormValues) => void;
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

export function CarForm({ initial, submitting, onSubmit, submitLabel = "Save Car" }: CarFormProps) {
  const [values, setValues] = useState<CarFormValues>(() => (initial ? { ...EMPTY, ...initial } : EMPTY));

  const set = <K extends keyof CarFormValues>(key: K, val: CarFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: val }));

  const setSpec = (key: keyof CarFormValues["specifications"], val: string) =>
    setValues((v) => ({ ...v, specifications: { ...v.specifications, [key]: val } }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ ...values, name: values.name || `${values.brand} ${values.model}`.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
        <h3 className="mb-5 font-display text-lg font-bold uppercase text-bone">Basic Information</h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Brand">
            <input required className={inputClass} value={values.brand} onChange={(e) => set("brand", e.target.value)} placeholder="BMW" />
          </Field>
          <Field label="Model">
            <input required className={inputClass} value={values.model} onChange={(e) => set("model", e.target.value)} placeholder="M4 Competition" />
          </Field>
          <Field label="Display Name (optional)">
            <input className={inputClass} value={values.name} onChange={(e) => set("name", e.target.value)} placeholder="Defaults to Brand + Model" />
          </Field>
          <Field label="Year">
            <input type="number" required className={inputClass} value={values.year} onChange={(e) => set("year", Number(e.target.value))} />
          </Field>
          <Field label="Category">
            <input required className={inputClass} value={values.category} onChange={(e) => set("category", e.target.value)} placeholder="Coupe, SUV, Supercar…" />
          </Field>
          <Field label="Base Price">
            <input type="number" required className={inputClass} value={values.basePrice} onChange={(e) => set("basePrice", Number(e.target.value))} />
          </Field>
          <Field label="Currency">
            <input className={inputClass} value={values.currency} onChange={(e) => set("currency", e.target.value)} placeholder="USD" />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Description">
            <textarea
              required
              rows={4}
              className={inputClass}
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Precision engineering with aggressive performance…"
            />
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
        <h3 className="mb-5 font-display text-lg font-bold uppercase text-bone">Specifications</h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["engine", "Engine", "3.0L Twin-Turbo I6"],
              ["power", "Power", "503 hp"],
              ["torque", "Torque", "479 lb-ft"],
              ["transmission", "Transmission", "8-Speed Auto"],
              ["drive", "Drive", "RWD"],
              ["topSpeed", "Top Speed", "180 mph"],
              ["zeroToHundred", "0–100 km/h", "3.8s"],
            ] as const
          ).map(([key, label, placeholder]) => (
            <Field key={key} label={label}>
              <input className={inputClass} value={values.specifications[key]} onChange={(e) => setSpec(key, e.target.value)} placeholder={placeholder} />
            </Field>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
        <h3 className="mb-5 font-display text-lg font-bold uppercase text-bone">Media</h3>
        <div className="space-y-6">
          <MediaUploader label="Hero Image" folder={`cars`} value={values.heroImage} onChange={(url) => set("heroImage", url)} />
          <MultiImageUploader label="Gallery Images" folder={`cars`} value={values.galleryImages} onChange={(urls) => set("galleryImages", urls)} />
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
