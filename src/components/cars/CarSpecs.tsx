import { Gauge, Zap, Cog, Compass, Timer, Wind, GitBranch } from "lucide-react";
import type { CarSpecifications } from "@/types";

export function CarSpecs({ specs }: { specs: CarSpecifications }) {
  const items = [
    { label: "Engine", value: specs.engine, icon: Cog },
    { label: "Power", value: specs.power, icon: Zap },
    { label: "Torque", value: specs.torque, icon: GitBranch },
    { label: "Transmission", value: specs.transmission, icon: Compass },
    { label: "Drive", value: specs.drive, icon: Wind },
    { label: "Top Speed", value: specs.topSpeed, icon: Gauge },
    { label: "0–100 km/h", value: specs.zeroToHundred, icon: Timer },
  ].filter((i) => i.value);

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-2xl border border-white/10 bg-ink-700/60 p-5">
          <Icon size={18} className="mb-3 text-ignition" />
          <p className="text-[11px] font-semibold uppercase tracking-widest2 text-bone-dim">{label}</p>
          <p className="mt-1 font-display text-lg font-semibold text-bone">{value}</p>
        </div>
      ))}
    </div>
  );
}
