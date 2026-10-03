"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getBusinessSettings, updateBusinessSettings } from "@/lib/firestore/settings";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { useToast } from "@/hooks/useToast";
import type { BusinessSettings } from "@/types";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-ink-900 px-3.5 py-2.5 text-sm text-bone placeholder:text-bone-dim/60 focus:border-ignition focus:outline-none";

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest2 text-bone-dim">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-bone-dim/70">{hint}</p>}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [values, setValues] = useState<BusinessSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    getBusinessSettings().then(setValues);
  }, []);

  const set = <K extends keyof BusinessSettings>(key: K, val: BusinessSettings[K]) =>
    setValues((v) => (v ? { ...v, [key]: val } : v));

  const handleSave = async () => {
    if (!values) return;
    setSaving(true);
    try {
      await updateBusinessSettings(values);
      push("Business settings saved.");
    } catch {
      push("Couldn't save changes.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!values) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-ignition" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="font-display text-2xl font-bold uppercase text-bone">Business Settings</h1>

      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
        <h3 className="mb-5 font-display text-lg font-bold uppercase text-bone">Identity</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Business Name">
            <input className={inputClass} value={values.businessName} onChange={(e) => set("businessName", e.target.value)} />
          </Field>
          <Field label="Currency" hint="3-letter ISO code, e.g. USD, EUR, AED">
            <input className={inputClass} value={values.currency} onChange={(e) => set("currency", e.target.value)} />
          </Field>
        </div>
        <div className="mt-5">
          <MediaUploader label="Logo" folder="branding" value={values.logo} onChange={(url) => set("logo", url)} />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
        <h3 className="mb-5 font-display text-lg font-bold uppercase text-bone">Contact</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="WhatsApp Number" hint="Include country code, digits only — e.g. 15551234567">
            <input className={inputClass} value={values.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} />
          </Field>
          <Field label="Phone">
            <input className={inputClass} value={values.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="Email">
            <input type="email" className={inputClass} value={values.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Business Hours">
            <input className={inputClass} value={values.businessHours} onChange={(e) => set("businessHours", e.target.value)} />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Address">
            <input className={inputClass} value={values.address} onChange={(e) => set("address", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
        <h3 className="mb-5 font-display text-lg font-bold uppercase text-bone">Social</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Instagram URL">
            <input className={inputClass} value={values.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} />
          </Field>
          <Field label="Facebook URL">
            <input className={inputClass} value={values.facebook ?? ""} onChange={(e) => set("facebook", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
        <h3 className="mb-5 font-display text-lg font-bold uppercase text-bone">Accent Color</h3>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={values.accentColor || "#ff6a1a"}
            onChange={(e) => set("accentColor", e.target.value)}
            className="h-11 w-16 cursor-pointer rounded-lg border border-white/10 bg-transparent"
          />
          <input className={inputClass} value={values.accentColor || ""} onChange={(e) => set("accentColor", e.target.value)} />
        </div>
        <p className="mt-2 text-xs text-bone-dim/70">
          Stored for reference. The storefront theme currently ships a fixed ignition-orange accent in tailwind.config.ts — wire this value in if you want it theme-controlled.
        </p>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-ignition px-6 py-3 text-xs font-semibold uppercase tracking-widest2 text-ink-900 transition-colors hover:bg-ignition-soft disabled:opacity-60"
      >
        {saving && <Loader2 size={14} className="animate-spin" />}
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}
