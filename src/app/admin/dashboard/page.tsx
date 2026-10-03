"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Car, Wrench, Star, PackageCheck, Users, Sparkles, Plus } from "lucide-react";
import { getAllCars } from "@/lib/firestore/cars";
import { getAllModifications } from "@/lib/firestore/modifications";
import { getAllLeads } from "@/lib/firestore/leads";
import { DashboardCard } from "@/components/admin/DashboardCard";
import { formatDate } from "@/lib/utils";
import { formatMoney } from "@/lib/whatsapp";
import type { Car as CarType, Modification, Lead } from "@/types";

export default function AdminDashboardPage() {
  const [cars, setCars] = useState<CarType[]>([]);
  const [mods, setMods] = useState<Modification[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllCars(), getAllModifications(), getAllLeads()])
      .then(([c, m, l]) => {
        setCars(c);
        setMods(m);
        setLeads(l);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Cars", value: cars.length, icon: Car, accent: true },
    { label: "Featured Cars", value: cars.filter((c) => c.featured).length, icon: Star },
    { label: "Total Modifications", value: mods.length, icon: Wrench },
    { label: "Available Parts", value: mods.filter((m) => m.available).length, icon: PackageCheck },
    { label: "Total Leads", value: leads.length, icon: Users, accent: true },
    { label: "New Leads", value: leads.filter((l) => l.status === "NEW").length, icon: Sparkles },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-bone">Dashboard</h1>
          <p className="text-sm text-bone-dim">An overview of your showroom.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/cars/new" className="inline-flex items-center gap-2 rounded-lg bg-ignition px-4 py-2.5 text-xs font-semibold uppercase tracking-widest2 text-ink-900">
            <Plus size={14} /> Add Car
          </Link>
          <Link href="/admin/modifications/new" className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest2 text-bone hover:bg-white/5">
            <Plus size={14} /> Add Modification
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <DashboardCard key={s.label} {...s} value={loading ? "…" : s.value} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold uppercase text-bone">Recent Leads</h2>
            <Link href="/admin/leads" className="text-xs font-semibold uppercase tracking-widest2 text-ignition">View All</Link>
          </div>
          {leads.length === 0 ? (
            <p className="text-sm text-bone-dim">No leads yet.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {leads.slice(0, 5).map((lead) => (
                <li key={lead.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="text-bone">{lead.carName}</p>
                    <p className="text-xs text-bone-dim">{formatDate(lead.createdAt)}</p>
                  </div>
                  <span className="font-display font-semibold text-ignition">{formatMoney(lead.totalPrice, lead.currency)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold uppercase text-bone">Recent Cars</h2>
            <Link href="/admin/cars" className="text-xs font-semibold uppercase tracking-widest2 text-ignition">View All</Link>
          </div>
          {cars.length === 0 ? (
            <p className="text-sm text-bone-dim">No cars yet.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {cars.slice(0, 5).map((car) => (
                <li key={car.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="text-bone">{car.brand} {car.model}</p>
                    <p className="text-xs text-bone-dim">{car.year} · {car.category}</p>
                  </div>
                  <span className="font-display font-semibold text-bone">{formatMoney(car.basePrice, car.currency)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
