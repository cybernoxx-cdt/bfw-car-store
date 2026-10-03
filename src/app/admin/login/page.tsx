"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Loader2, Lock, Mail } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.replace("/admin/dashboard");
    }
  }, [user, isAdmin, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="font-display text-2xl font-bold uppercase tracking-widest2 text-bone">
            Admin<span className="text-ignition">.</span>
          </span>
          <p className="mt-2 text-sm text-bone-dim">Sign in to manage your showroom</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-[#111114] p-8">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest2 text-bone-dim">
              Email
            </label>
            <div className="relative">
              <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-bone-dim" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-ink-900 py-2.5 pl-10 pr-3 text-sm text-bone focus:border-ignition focus:outline-none"
                placeholder="you@showroom.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest2 text-bone-dim">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-bone-dim" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-ink-900 py-2.5 pl-10 pr-3 text-sm text-bone focus:border-ignition focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-sm text-signal-stop">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-ignition py-3 text-xs font-semibold uppercase tracking-widest2 text-ink-900 transition-colors hover:bg-ignition-soft disabled:opacity-60"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {submitting ? "Signing In…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
