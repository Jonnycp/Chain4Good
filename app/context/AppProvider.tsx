import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export type Project = {
  _id: string;
  ente: {
    id: string;
    nome: string;
    profilePicture: string;
  };
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
  createdAt: Date;
  numeroSpese: number;
  totaleSpeso: number;
};

export type Spesa = {
      _id: string;
      title: string;
      description: string;
      category: string;
      amount: number;
      preventivo: string;
      requestId: number;
      hashCreation: string;
      status: "votazione" | "approvata" | "rifiutata";
      executed: boolean;
      hashExecution?: string;
      createdAt: Date;
      votes: {
        votesFor: number;
        votesAgainst: number;
      }
      myVote: {
        vote: "for" | "against";
        timestamp: Date;
        motivation?: string;
        hashVote: string;
      } | null;
    }
interface AppContextType {
  user: {
    address: string;
    username: string;
    email?: string;
    profilePicture: string;
    nonce: string;
    createdAt: Date;
    updatedAt: Date;
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
  projectDonations: {
    totDonors: number;
    donors: Array<{
      id: string;
      profilePicture: string;
      username: string;
      messaggio?: string;
      amount: number;
      symbol: string;
      hashTransaction: string;
      createdAt: Date;
    }>;
  };
  projectSpese: {
    spese: Array<Spesa>;
    sommaSpese: number;
    totSpese: number;
    spesaNonVerificata?: string;
  };
  setCurrentProjectId: (id: string | null) => void;
  loading: {
    user: boolean;
    projectsExplore: boolean;
    projectsByCategory: boolean;
    myProjects: boolean;
    projectDonations: boolean;
    projectSpese: boolean;
  };
  refetchAll: () => void;
  setCategory: (cat: string) => void;
  contracts: {
    enteNft: string;
    eurc: string;
    factory: string;
  } | null;
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
      const res = await fetch(
        `${API_BASE_URL}/projects?limit=6&sort=endDate&order=asc`,
        {
          credentials: "include",
        }
      );
      if (res.status === 401) return [];
      if (!res.ok) throw new Error("Errore durante il fetch dei progetti");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
    enabled: user !== null && !userLoading && !user.isEnte,
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
        `${API_BASE_URL}/projects?category=${selectedCategory}&limit=6&order=asc`,
        {
          credentials: "include",
        }
      ).then((res) => res.json()),
    staleTime: 1000 * 60 * 5,
    enabled: user !== null && !userLoading && !user.isEnte,
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
      if (!res.ok) throw new Error("Errore durante il fetch dei progetti");
      return res.json();
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: user !== null && !userLoading && user.isEnte,
  });

  // Query per le donazioni del progetto corrente
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const {
    data: projectDonationsData,
    isLoading: projectDonationsLoading,
    refetch: refetchProjectDonations,
  } = useQuery({
    queryKey: ["project-donations", currentProjectId],
    queryFn: async () => {
      if (!currentProjectId) return { donors: [], totDonors: 0 };
      const res = await fetch(
        `${API_BASE_URL}/projects/${currentProjectId}/donations`,
        {
          credentials: "include",
        }
      );
      return res.json();
    },
    enabled: user !== null && !userLoading && !!currentProjectId,
    staleTime: 1000 * 30, // 30 secondi
  });

  const {
    data: projectSpeseData,
    isLoading: projectSpeseLoading,
    refetch: refetchProjectSpese,
  } = useQuery({
    queryKey: ["project-spese", currentProjectId],
    queryFn: async () => {
      if (!currentProjectId) return { donors: [], totDonors: 0 };
      const res = await fetch(
        `${API_BASE_URL}/projects/${currentProjectId}/spese`,
        {
          credentials: "include",
        }
      );
      return res.json();
    },
    enabled: user !== null && !userLoading && !!currentProjectId,
    staleTime: 1000 * 30, // 30 secondi
  });

  // Indirizzi contratti blockchain
  const { data: contractConfig } = useQuery({
    queryKey: ["contractAddresses"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/auth/contracts`);
      return res.json();
    },
    staleTime: Infinity, // Non cambiano mai... in sessione
  });

  const value = {
    user: user || null,
    loading: {
      user: userLoading,
      projectsExplore: isLoadingExplore,
      projectsByCategory: isLoadingCategory,
      myProjects: isLoadingMyProjects,
      projectDonations: projectDonationsLoading,
      projectSpese: projectSpeseLoading,
    },
    projects: {
      explore: projectsExplore || [],
      byCategory: projectsByCategory || [],
      selectedCategory,
      myProjects: myProjects || [],
    },
    projectDonations: projectDonationsData || { donors: [], totDonors: 0 },
    projectSpese: projectSpeseData || { spese: [], sommaSpese: 0 },
    setCurrentProjectId,
    setCategory: (cat: string) => {
      setSelectedCategory(cat);
    },
    refetchAll: () => {
      refetchUser();
      refetchProjectsExplore();
      refetchProjectsByCategory();
      refetchMyProjects();
      refetchProjectDonations();
      refetchProjectSpese();
    },
    contracts: contractConfig,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp deve essere usato dentro AppProvider");
  return context;
};
