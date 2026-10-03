"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { getAllCars, deleteCar } from "@/lib/firestore/cars";
import { cldResponsive } from "@/lib/cloudinary";
import { formatMoney } from "@/lib/whatsapp";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { useToast } from "@/hooks/useToast";
import type { Car } from "@/types";

export default function CarsListPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Car | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { push } = useToast();

  const load = () => getAllCars().then((data) => { setCars(data); setLoading(false); });

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cars;
    return cars.filter((c) => `${c.brand} ${c.model} ${c.category}`.toLowerCase().includes(q));
  }, [cars, search]);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteCar(pendingDelete.id);
      push("Car deleted.");
      setPendingDelete(null);
      load();
    } catch {
      push("Couldn't delete the car.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const columns: DataTableColumn<Car>[] = [
    {
      header: "Vehicle",
      render: (car) => (
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md bg-ink-900">
            {car.heroImage && <Image src={cldResponsive(car.heroImage, 150)} alt={car.name} fill className="object-cover" />}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-bone">{car.brand} {car.model}</p>
            <p className="text-xs text-bone-dim">{car.year} · {car.category}</p>
          </div>
          {car.featured && <Star size={13} className="shrink-0 fill-ignition text-ignition" />}
        </div>
      ),
    },
    { header: "Price", render: (car) => formatMoney(car.basePrice, car.currency) },
    {
      header: "Status",
      render: (car) => (
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest2 ${car.available ? "bg-signal-go/15 text-signal-go" : "bg-signal-stop/15 text-signal-stop"}`}>
          {car.available ? "Available" : "Sold"}
        </span>
      ),
    },
    {
      header: "",
      className: "text-right",
      render: (car) => (
        <div className="flex justify-end gap-3">
          <Link href={`/admin/cars/${car.id}/edit`} className="text-bone-dim hover:text-ignition" aria-label="Edit"><Pencil size={16} /></Link>
          <button onClick={() => setPendingDelete(car)} className="text-bone-dim hover:text-signal-stop" aria-label="Delete"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold uppercase text-bone">Cars</h1>
        <Link href="/admin/cars/new" className="inline-flex items-center gap-2 rounded-lg bg-ignition px-4 py-2.5 text-xs font-semibold uppercase tracking-widest2 text-ink-900">
          <Plus size={14} /> Add Car
        </Link>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(c) => c.id}
        loading={loading}
        searchable
        onSearch={setSearch}
        emptyTitle="No cars yet"
        emptyDescription="Add your first vehicle to start building the collection."
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        message={`Delete "${pendingDelete?.brand} ${pendingDelete?.model}"? This can't be undone.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
