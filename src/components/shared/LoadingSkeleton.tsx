import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-white/5", className)} />;
}

export function CarCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-700">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative flex h-[100svh] w-full items-center justify-center bg-ink-900">
      <div className="w-full max-w-6xl px-6">
        <Skeleton className="mb-6 h-3 w-40" />
        <Skeleton className="mb-4 h-16 w-3/4" />
        <Skeleton className="mb-8 h-4 w-1/2" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-40 rounded-full" />
          <Skeleton className="h-12 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
