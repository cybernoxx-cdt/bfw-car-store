import type { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: boolean;
}

export function DashboardCard({ label, value, icon: Icon, accent }: DashboardCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest2 text-bone-dim">{label}</p>
        <Icon size={18} className={accent ? "text-ignition" : "text-bone-dim"} />
      </div>
      <p className="mt-4 font-display text-3xl font-bold text-bone">{value}</p>
    </div>
  );
}
