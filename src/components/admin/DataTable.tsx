"use client";

import { useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableRowSkeleton } from "@/components/shared/LoadingSkeleton";

export interface DataTableColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  searchable?: boolean;
  onSearch?: (term: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  toolbar?: ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  searchable,
  onSearch,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  toolbar,
}: DataTableProps<T>) {
  const [term, setTerm] = useState("");

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111114]">
      {(searchable || toolbar) && (
        <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          {searchable && (
            <div className="relative max-w-xs flex-1">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bone-dim" />
              <input
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value);
                  onSearch?.(e.target.value);
                }}
                placeholder="Search…"
                className="w-full rounded-lg border border-white/10 bg-ink-900 py-2 pl-9 pr-3 text-sm text-bone placeholder:text-bone-dim focus:border-ignition focus:outline-none"
              />
            </div>
          )}
          {toolbar}
        </div>
      )}

      {!loading && rows.length === 0 ? (
        <div className="p-4">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-widest2 text-bone-dim">
                {columns.map((col) => (
                  <th key={col.header} className={`px-4 py-3 ${col.className ?? ""}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={columns.length} />)
                : rows.map((row) => (
                    <tr key={rowKey(row)} className="text-bone/90 transition-colors hover:bg-white/[0.03]">
                      {columns.map((col) => (
                        <td key={col.header} className={`px-4 py-3.5 ${col.className ?? ""}`}>
                          {col.render(row)}
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
