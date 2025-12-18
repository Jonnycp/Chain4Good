import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface AppContextType {
  user: {
    address: string;
    username: string;
    email?: string;
    profilePicture?: string;
    nonce: string;
    createdAt: Date;
    lastLogin?: Date;
  } | null;
  loading: {
    user: boolean;
  };
  refetchAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export default function AppProvider({ children, initialUser }: { children: ReactNode, initialUser?: AppContextType["user"] }) {
  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch(API_BASE_URL + "/auth/me", {
        credentials: "include",
      });
      if (res.status === 401) return null;
      if (!res.ok)
        throw new Error("Errore durante il fetch dell'utente autenticato");
      return res.json();
    },
    staleTime: 1000 * 60 * 30,
    initialData: initialUser || null,
    retry: false,
  });

  const value = {
    user: user || null,
    loading: {
      user: userLoading,
    },
    refetchAll: () => {
      refetchUser();
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp deve essere usato dentro AppProvider");
  return context;
};
