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
}

const AuthContext = createContext<AuthState>({ user: null, isAdmin: false, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isAdmin: false, loading: true });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ user: null, isAdmin: false, loading: false });
        return;
      }

      // The frontend check below is only a UX convenience so the admin UI
      // doesn't flash for signed-in-but-not-admin accounts. The real
      // boundary is enforced server-side by Firestore security rules,
      // which independently re-check users/{uid}.role on every read/write.
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const isAdmin = snap.exists() && snap.data().role === "admin";
        setState({ user, isAdmin, loading: false });
      } catch {
        setState({ user, isAdmin: false, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
