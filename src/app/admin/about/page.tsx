"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { getAboutInfo, updateAboutInfo, DEFAULT_ABOUT } from "@/lib/firestore/about";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { useToast } from "@/hooks/useToast";
import type { AboutInfo } from "@/types";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-ink-900 px-3.5 py-2.5 text-sm text-bone placeholder:text-bone-dim/60 focus:border-ignition focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest2 text-bone-dim">{label}</label>
      {children}
    </div>
  );
}

export default function AdminAboutPage() {
  const [values, setValues] = useState<AboutInfo | null>(null);
  const [newValue, setNewValue] = useState("");
  const [saving, setSaving] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    getAboutInfo().then(setValues);
  }, []);

  const set = <K extends keyof AboutInfo>(key: K, val: AboutInfo[K]) =>
    setValues((v) => (v ? { ...v, [key]: val } : v));

  const addValue = () => {
    if (!newValue.trim() || !values) return;
    set("values", [...values.values, newValue.trim()]);
    setNewValue("");
  };

  const removeValue = (i: number) => {
    if (!values) return;
    set("values", values.values.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    if (!values) return;
    setSaving(true);
    try {
      await updateAboutInfo(values);
      push("About page updated.");
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
      <h1 className="font-display text-2xl font-bold uppercase text-bone">About Page</h1>

      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
        <h3 className="mb-5 font-display text-lg font-bold uppercase text-bone">Owner Profile</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Owner Name">
            <input className={inputClass} value={values.ownerName} onChange={(e) => set("ownerName", e.target.value)} />
          </Field>
          <Field label="Owner Role">
            <input className={inputClass} value={values.ownerRole} onChange={(e) => set("ownerRole", e.target.value)} />
          </Field>
        </div>
        <div className="mt-5">
          <MediaUploader label="Owner Image" folder="about" value={values.ownerImage} onChange={(url) => set("ownerImage", url)} />
        </div>
        <div className="mt-5">
          <Field label="Biography">
            <textarea rows={4} className={inputClass} value={values.biography} onChange={(e) => set("biography", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
        <h3 className="mb-5 font-display text-lg font-bold uppercase text-bone">Company Story</h3>
        <textarea rows={6} className={inputClass} value={values.companyStory} onChange={(e) => set("companyStory", e.target.value)} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
        <h3 className="mb-5 font-display text-lg font-bold uppercase text-bone">Mission & Vision</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Mission">
            <textarea rows={3} className={inputClass} value={values.mission} onChange={(e) => set("mission", e.target.value)} />
          </Field>
          <Field label="Vision">
            <textarea rows={3} className={inputClass} value={values.vision} onChange={(e) => set("vision", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
        <h3 className="mb-5 font-display text-lg font-bold uppercase text-bone">Values</h3>
        <div className="mb-4 flex flex-wrap gap-2">
          {values.values.map((v, i) => (
            <span key={i} className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-bone">
              {v}
              <button onClick={() => removeValue(i)} aria-label={`Remove ${v}`}><X size={12} className="text-bone-dim hover:text-signal-stop" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addValue())}
            placeholder="Add a value, e.g. Craftsmanship"
            className={inputClass}
          />
          <button onClick={addValue} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest2 text-bone hover:bg-white/5">
            <Plus size={14} /> Add
          </button>
        </div>
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
