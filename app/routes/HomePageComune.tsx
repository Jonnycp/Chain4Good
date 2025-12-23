import Header from "~/components/Header";
import Navbar from "~/components/Navbar";
import ProjectsGrid from "~/components/ProjectGrid";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

//Provider
import { useApp } from "../context/AppProvider";

export default function HomePage() {
  const { user, projects, setCategory, loading } = useApp();
  const { explore, byCategory, selectedCategory, myProjects } = projects;

  const categories = [
    { id: "medical", label: "Spese mediche", icon: "icon-park-outline:like" },
    { id: "education", label: "Istruzione", icon: "qlementine-icons:book-16" },
    { id: "environment", label: "Ambiente", icon: "icon-park-outline:tree" },
    {
      id: "emergency",
      label: "Emergenze",
      icon: "material-symbols-light:e911-emergency",
    },
    { id: "sport", label: "Sport", icon: "fluent:sport-20-regular" },
  ];

  return (
    <div
      className={`min-h-screen font-sans relative transition-colors ${user?.isEnte ? "bg-gray-50 pb-20" : "bg-[#F8FAFC] pb-28 md:pb-10"}`}
    >
      {/* HEADER DINAMICO */}
      <Header
        type={user?.isEnte ? "ente" : "utente"}
        profileImage={user?.profilePicture || ""}
        activePage="home"
      />

      <div className="w-full max-w-7xl mx-auto">
        {/* BARRA DI RICERCA (Comune a entrambi) */}
        <div className="px-6 mb-8 md:mb-10 md:flex md:justify-center">
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <Icon
              icon="solar:magnifer-linear"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <input
              type="text"
              placeholder="Cerca progetti..."
              className="w-full bg-white text-secondary rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm placeholder-gray-400 font-medium text-sm border border-transparent focus:border-primary"
            />
          </div>
        </div>

        {user?.isEnte ? (
          // VISTA ENTE (RESPONSIVE)
            <><ProjectsGrid
              title="I tuoi progetti"
              titleRight={
                <Link
                  className="hidden md:flex bg-primary text-white font-bold rounded-xl px-6 py-2 shadow-md hover:bg-green-600 transition"
                  to={"/nuovo-progetto"}
                >
                  <Icon icon="mdi:plus" className="w-5 h-5 mr-1" />
                  Nuovo Progetto
                </Link>
              } 
              isMyProjects={true}
              projects={myProjects}
              loading={loading.myProjects}
              skeletonCount={1}
              emptyText={
                <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon
                      icon="solar:folder-with-files-linear"
                      className="text-3xl text-slate-400"
                    />
                  </div>
                  <p className="text-slate-500 font-medium">
                    Non hai ancora creato progetti.
                  </p>
                  <Link
                    className="mt-4 text-primary font-bold text-sm underline"
                    to={"/nuovo-progetto"}
                  >
                    Crea il primo ora
                  </Link>
                </div>
              }
            />

            {/* FAB (Floating Action Button) - Visibile solo su MOBILE/TABLET */}
            <div className="fixed bottom-6 right-4 z-30 md:hidden">
              <Link
                className="bg-primary text-white font-bold shadow-lg shadow-green-500/30 rounded-full w-14 h-14 min-w-0 p-0 flex items-center justify-center hover:bg-green-600 transition"
                to={"/nuovo-progetto"}
              >
                <Icon icon="mdi:plus" className="w-8 h-8" />
              </Link>
            </div></>
   
        ) : (
          // VISTA UTENTE (RESPONSIVE)
          <>
            <ProjectsGrid
              title="Progetti in scadenza"
              projects={explore}
              loading={loading.projectsExplore}
              skeletonCount={3}
              emptyIcon="solar:box-minimalistic-linear"
              emptyText="Nessun progetto in scadenza."
            />

            <ProjectsGrid
              title="Categorie"
              projects={byCategory}
              loading={loading.projectsByCategory}
              skeletonCount={3}
              categories={categories}
              selectedCategory={selectedCategory}
              setCategory={setCategory}
              emptyIcon="solar:box-minimalistic-linear"
              emptyText="Nessun progetto trovato in questa categoria."
            />

            {/* Navbar Mobile (Solo per Utente) */}
            <Navbar active="home" />
            <footer className="mt-12 text-center text-gray-400 text-sm pb-8">
              © {new Date().getFullYear()} - Chain4Good
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
