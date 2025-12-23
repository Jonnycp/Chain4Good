import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export type Project = {
  _id: string;
  ente: {
    id: string;
    nome: string;
    profilePicture: string;
  },
  titolo: string;
  cover: string;
  stato: "raccolta" | "attivo" | "completato" | "annullato";
  luogo: string;
  endDate: string;
  targetAmount: number;
  currentAmount: number;
  numeroDonatori: number;
  currency: string;
  lastDonors: Array<{
    id: string;
    profilePicture: string;
  }>;
};

interface AppContextType {
  user: {
    address: string;
    username: string;
    email?: string;
    profilePicture: string;
    nonce: string;
    createdAt: Date;
    lastLogin?: Date;
    isEnte: boolean;
    enteDetails: {
      nome: string;
      denominazioneSociale: string;
      descrizioneEnte: string;
      indirizzoSedeLegale: string;
      codiceFiscale: string;
      partitaIva?: string;
      sitoWeb?: string;
    } | null;
  } | null;
  projects: {
    explore: Project[];
    byCategory: Project[];
    myProjects: Project[];
    selectedCategory: string | null;
  };
  loading: {
    user: boolean;
    projectsExplore: boolean;
    projectsByCategory: boolean;
    myProjects: boolean;
  };
  refetchAll: () => void;
  setCategory: (cat: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export default function AppProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: AppContextType["user"];
}) {
  
  const queryClient = useQueryClient();
  useEffect(() => {
    if (initialUser) {
      queryClient.setQueryData(["authUser"], initialUser);
    }
  }, [initialUser, queryClient]);

  //Query utente
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

  //Query progetti esplora
  const {
    data: projectsExplore,
    isLoading: isLoadingExplore,
    refetch: refetchProjectsExplore,
  } = useQuery({
    queryKey: ["projects", "explore"],
    queryFn: async () => {
     const res = await fetch(`${API_BASE_URL}/projects?limit=6&sort=endDate&order=asc`, {
        credentials: "include",
      });
      if (res.status === 401) return [];
      if (!res.ok)
        throw new Error("Errore durante il fetch dei progetti");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
    enabled: user !== null && !userLoading,
  });

  //Query progetti per categoria
  const [selectedCategory, setSelectedCategory] = useState<string>("medical");

  const {
    data: projectsByCategory,
    isLoading: isLoadingCategory,
    refetch: refetchProjectsByCategory,
  } = useQuery({
    queryKey: ["projects", "category", selectedCategory],
    queryFn: () =>
      fetch(
        `${API_BASE_URL}/projects?category=${selectedCategory}&limit=6&order=asc`, {
        credentials: "include",
      }
      ).then((res) => res.json()),
    staleTime: 1000 * 60 * 5,
    enabled: user !== null && !userLoading,
  });

  //Query progetti ente
  const {
    data: myProjects,
    isLoading: isLoadingMyProjects,
    refetch: refetchMyProjects,
  } = useQuery({
    queryKey: ["projects", "myProjects"],
    queryFn: async () => {
     const res = await fetch(`${API_BASE_URL}/projects/me`, {
        credentials: "include",
      });
      if (res.status === 401) return [];
      if (!res.ok)
        throw new Error("Errore durante il fetch dei progetti");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
    enabled: user !== null && !userLoading && user.isEnte,
  });

  const value = {
    user: user || null,
    loading: {
      user: userLoading,
      projectsExplore: isLoadingExplore,
      projectsByCategory: isLoadingCategory,
      myProjects: isLoadingMyProjects,
    },
    projects: {
      explore: projectsExplore || [],
      byCategory: projectsByCategory || [],
      selectedCategory,
      myProjects: myProjects || [],
    },
    setCategory: (cat: string) => {
      setSelectedCategory(cat);
    },
    refetchAll: () => {
      refetchUser();
      refetchProjectsExplore();
      refetchProjectsByCategory();
      refetchMyProjects();
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp deve essere usato dentro AppProvider");
  return context;
};
