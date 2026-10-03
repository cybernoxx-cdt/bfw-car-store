import { Inbox, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
      <Icon size={28} className="mb-4 text-bone-dim" />
      <p className="font-display text-xl font-semibold text-bone">{title}</p>
      {description && <p className="mt-2 max-w-sm text-sm text-bone-dim">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
