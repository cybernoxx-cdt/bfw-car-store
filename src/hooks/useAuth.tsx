"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthState>({
  user: null,
  isAdmin: false,
  loading: true,
  authError: null,
});

const configuredAdminEmail =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase() || "";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    loading: true,
    authError: null,
  });

  useEffect(() => {
    let alive = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!alive) return;

      if (!user) {
        setState({
          user: null,
          isAdmin: false,
          loading: false,
          authError: null,
        });
        return;
      }

      const emailMatches =
        !!user.email &&
        !!configuredAdminEmail &&
        user.email.trim().toLowerCase() === configuredAdminEmail;

      let roleMatches = false;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        roleMatches = snap.exists() && snap.data()?.role === "admin";
      } catch {
        // Ignore Firestore issues; configured admin email remains valid.
      }

      if (!alive) return;

      setState({
        user,
        isAdmin: emailMatches || roleMatches,
        loading: false,
        authError: null,
      });
    });

    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
