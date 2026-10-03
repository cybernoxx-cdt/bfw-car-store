"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getAllModifications, deleteModification } from "@/lib/firestore/modifications";
import { getAllCars } from "@/lib/firestore/cars";
import { getAllCategories } from "@/lib/firestore/categories";
import { cldResponsive } from "@/lib/cloudinary";
import { formatMoney } from "@/lib/whatsapp";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { useToast } from "@/hooks/useToast";
import type { Modification, Car, Category } from "@/types";

export default function ModificationsListPage() {
  const [mods, setMods] = useState<Modification[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Modification | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { push } = useToast();

  const load = () =>
    Promise.all([getAllModifications(), getAllCars(), getAllCategories()]).then(([m, c, cat]) => {
      setMods(m);
      setCars(c);
      setCategories(cat);
      setLoading(false);
    });

  useEffect(() => {
    load();
  }, []);

  const carName = (id: string) => { const c = cars.find((x) => x.id === id); return c ? `${c.brand} ${c.model}` : "—"; };
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mods;
    return mods.filter((m) => `${m.name} ${carName(m.carId)} ${categoryName(m.categoryId)}`.toLowerCase().includes(q));
  }, [mods, search, cars, categories]);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteModification(pendingDelete.id);
      push("Modification deleted.");
      setPendingDelete(null);
      load();
    } catch {
      push("Couldn't delete the modification.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const columns: DataTableColumn<Modification>[] = [
    {
      header: "Part",
      render: (mod) => (
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-md bg-ink-900">
            {mod.image && <Image src={cldResponsive(mod.image, 150)} alt={mod.name} fill className="object-cover" />}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-bone">{mod.name}</p>
            <p className="text-xs text-bone-dim">{carName(mod.carId)}</p>
          </div>
        </div>
      ),
    },
    { header: "Category", render: (mod) => categoryName(mod.categoryId) },
    { header: "Price", render: (mod) => formatMoney(mod.price, mod.currency) },
    {
      header: "Status",
      render: (mod) => (
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest2 ${mod.available ? "bg-signal-go/15 text-signal-go" : "bg-signal-stop/15 text-signal-stop"}`}>
          {mod.available ? "Available" : "Unavailable"}
        </span>
      ),
    },
    {
      header: "",
      className: "text-right",
      render: (mod) => (
        <div className="flex justify-end gap-3">
          <Link href={`/admin/modifications/${mod.id}/edit`} className="text-bone-dim hover:text-ignition" aria-label="Edit"><Pencil size={16} /></Link>
          <button onClick={() => setPendingDelete(mod)} className="text-bone-dim hover:text-signal-stop" aria-label="Delete"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold uppercase text-bone">Modifications</h1>
        <Link href="/admin/modifications/new" className="inline-flex items-center gap-2 rounded-lg bg-ignition px-4 py-2.5 text-xs font-semibold uppercase tracking-widest2 text-ink-900">
          <Plus size={14} /> Add Modification
        </Link>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(m) => m.id}
        loading={loading}
        searchable
        onSearch={setSearch}
        emptyTitle="No modifications yet"
        emptyDescription="Add parts and they'll appear in each compatible car's configurator."
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        message={`Delete "${pendingDelete?.name}"? This can't be undone.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
