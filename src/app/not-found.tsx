import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <p className="font-display text-sm font-semibold uppercase tracking-widest2 text-ignition">404</p>
      <h1 className="mt-3 font-display text-4xl font-bold uppercase text-bone sm:text-5xl">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-bone-dim">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ignition px-7 py-3.5 text-xs font-semibold uppercase tracking-widest2 text-ink-900"
      >
        Back To Home
      </Link>
    </div>
  );
}
