import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth, googleProvider } from "../lib/firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  getIdToken,
} from "firebase/auth";

type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  firebaseUid?: string;
};
type AuthContextValue = {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const API = import.meta.env.VITE_API_URL;
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function exchangeAndFetchMe(idToken: string) {
  // 1) Обменять Firebase токен на сессию бэка
  const ok = await fetch(`${API}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    credentials: "include",
  });
  if (!ok.ok) throw new Error("Auth failed");

  // 2) Получить MeDto с UUID
  const meRes = await fetch(`${API}/api/me`, { credentials: "include" });
  if (!meRes.ok) throw new Error("Fetch /api/me failed");
  return (await meRes.json()) as {
    id: string;
    email: string;
    displayName?: string;
  };
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Витягуємо стан із Firebase та валідуємо на бекенді
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        // 1) беремо ID token від Google/Firebase
        const idToken = await getIdToken(fbUser, /*forceRefresh*/ true);
        const me = await exchangeAndFetchMe(idToken);

        // 2) віддаємо його бекенду для перевірки і видачі вашого JWT/сесії
        const res = await fetch(`${API}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
          credentials: "include", // якщо бек ставить cookie
        });
        if (!res.ok) throw new Error("Auth failed");

        // 3) локальний user для UI (можеш також зчитати з відповіді бека)
        setUser({
          id: me.id, // 👈 UUID с бэка
          email: me.email,
          name: me.displayName ?? fbUser.displayName ?? "",
          avatarUrl: fbUser.photoURL ?? undefined,
          firebaseUid: fbUser.uid,
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
    // onAuthStateChanged вище все доробить
  };

  const logout = async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    } finally {
      await signOut(auth);
      setUser(null);
      window.location.href = "/login";
    }
  };

  const refreshMe = async () => {
    setLoading(true);
    try {
      const fbUser = auth.currentUser;
      if (!fbUser) {
        setUser(null);
        return;
      }
      const idToken = await getIdToken(fbUser, true);
      const me = await exchangeAndFetchMe(idToken);
      // await fetch(`${API}/auth/google`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ idToken }),
      //   credentials: "include",
      // });
      setUser({
        id: me.id, // 👈 UUID с бэка
        email: me.email,
        name: me.displayName ?? fbUser.displayName ?? "",
        avatarUrl: fbUser.photoURL ?? undefined,
        firebaseUid: fbUser.uid,
      });
    } catch (e) {
      // опционально — мягкий лог/показ тоста
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ user, loading, loginWithGoogle, logout, refreshMe }),
    [user, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
