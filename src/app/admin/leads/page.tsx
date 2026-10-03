"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllLeads, updateLeadStatus } from "@/lib/firestore/leads";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { formatDate } from "@/lib/utils";
import { formatMoney } from "@/lib/whatsapp";
import { useToast } from "@/hooks/useToast";
import type { Lead, LeadStatus } from "@/types";

const STATUS_OPTIONS: LeadStatus[] = ["NEW", "CONTACTED", "COMPLETED", "CANCELLED"];

const STATUS_STYLES: Record<LeadStatus, string> = {
  NEW: "bg-signal-wait/15 text-signal-wait",
  CONTACTED: "bg-ignition/15 text-ignition",
  COMPLETED: "bg-signal-go/15 text-signal-go",
  CANCELLED: "bg-signal-stop/15 text-signal-stop",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { push } = useToast();

  useEffect(() => {
    getAllLeads().then((data) => { setLeads(data); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((l) => l.carName.toLowerCase().includes(q));
  }, [leads, search]);

  const changeStatus = async (lead: Lead, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    try {
      await updateLeadStatus(lead.id, status);
      push("Lead status updated.");
    } catch {
      push("Couldn't update the lead.", "error");
    }
  };

  const columns: DataTableColumn<Lead>[] = [
    { header: "Date", render: (l) => formatDate(l.createdAt) },
    { header: "Vehicle", render: (l) => <span className="font-semibold text-bone">{l.carName}</span> },
    {
      header: "Modifications",
      render: (l) =>
        l.selectedModifications.length === 0 ? (
          <span className="text-bone-dim">None</span>
        ) : (
          <span className="text-bone-dim">{l.selectedModifications.map((m) => m.name).join(", ")}</span>
        ),
    },
    { header: "Total", render: (l) => <span className="font-display font-semibold text-ignition">{formatMoney(l.totalPrice, l.currency)}</span> },
    {
      header: "Status",
      render: (l) => (
        <select
          value={l.status}
          onChange={(e) => changeStatus(l, e.target.value as LeadStatus)}
          className={`rounded-full border-0 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest2 focus:outline-none ${STATUS_STYLES[l.status]}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-ink-900 text-bone">{s}</option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl font-bold uppercase text-bone">Leads</h1>
      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(l) => l.id}
        loading={loading}
        searchable
        onSearch={setSearch}
        emptyTitle="No leads yet"
        emptyDescription="Leads are created automatically when customers submit a build from the Buy / Contact Seller button."
      />
    </div>
  );
}
