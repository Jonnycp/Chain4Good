import { useState, useRef } from "react";
import { Icon } from "@iconify/react";

import HeaderCover from "~/components/HeaderCover";
import CardHome from "~/components/CardHome";
import { API_BASE_URL, type Project } from "~/context/AppProvider";
import { redirect, useLoaderData } from "react-router";

export async function loader({ params, request }: { params: { id?: string }, request: Request  }) {
  const id = params.id?.trim();
  if (!id || id.length !== 24 || !/^[a-fA-F0-9]{24}$/.test(id)) {
    return redirect("/");
  }
  const res = await fetch(`${API_BASE_URL}/ente/${id}`, {
    credentials: "include",
    headers: {
      Cookie: request.headers.get("Cookie") || "",
    },
  });
  if (!res.ok) return redirect("/");
  const enteDetails = await res.json();
  if (!enteDetails) return redirect("/");
  return enteDetails;
}

export default function EnteVisibile() {
  const enteDetails = useLoaderData() as {
    _id: string;
    nome: string;
    denominazioneSociale: string;
    descrizioneEnte: string;
    indirizzoSedeLegale: string;
    codiceFiscale: string;
    partitaIva?: string;
    sitoWeb?: string;
    profilePicture: string;
    bannerImage?: string;
    isEnte: boolean;
    isMe: boolean;
    projects: Project[];
  };
  const [isEditing, setIsEditing] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // HANDLERS
  //   const handleSave = () => {
  //     console.log("Dati salvati:", enteInfo);
  //     setIsEditing(false);
  //   };

  //   const handleCancel = () => {
  //     setIsEditing(false); // Reset logica se necessario
  //   };

  //   const handleImageChange = (
  //     e: React.ChangeEvent<HTMLInputElement>,
  //     field: "cover" | "logo"
  //   ) => {
  //     if (e.target.files && e.target.files[0]) {
  //       const file = e.target.files[0];
  //       const imageUrl = URL.createObjectURL(file);
  //       setEnteInfo((prev) => ({ ...prev, [field]: imageUrl }));
  //     }
  //   };

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      {/* INPUT FILES */}
      <input
        type="file"
        ref={coverInputRef}
        //onChange={(e) => handleImageChange(e, "cover")}
        className="hidden"
        accept="image/*"
      />
      <input
        type="file"
        ref={logoInputRef}
        //onChange={(e) => handleImageChange(e, "logo")}
        className="hidden"
        accept="image/*"
      />

      {/* HEADER COVER - Full Width */}
      <div className="relative group w-full">
        <HeaderCover
          type={enteDetails?.isMe ? "ente" : "utente"}
          coverImage={enteDetails?.bannerImage}
          onShare={() => console.log("Share")}
          onDelete={() => console.log("Delete")}
        />

        {isEditing && (
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-black/70 transition backdrop-blur-sm border border-white/20 font-bold shadow-xl"
          >
            <Icon icon="mdi:camera" className="text-xl" /> Modifica Copertina
          </button>
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* CONTENITORE CONTENUTO (Max width per leggibilità su schermi giganti) */}
      <main className="max-w-7xl mx-auto px-6 relative z-10 -mt-20">
        {/* BARRA AZIONI (Posizionata relativamente al container) */}
        {enteDetails?.isMe && (
          <div className="absolute top-4 right-6 z-20">
            {isEditing ? (
              <div className="flex gap-2 animate-fade-in bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-xl">
                <button
                  //onClick={handleCancel}
                  className="bg-white text-red-500 w-12 h-12 rounded-full shadow-sm flex items-center justify-center hover:bg-red-50 transition border border-red-100"
                >
                  <Icon icon="mdi:close" className="text-2xl" />
                </button>
                <button
                  //onClick={handleSave}
                  className="bg-primary text-white w-12 h-12 rounded-full shadow-md flex items-center justify-center hover:bg-green-700 transition"
                >
                  <Icon icon="mdi:check" className="text-2xl" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white text-secondary w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:bg-slate-50 transition"
              >
                <Icon icon="mdi:pencil" className="text-xl" />
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
          {/* LOGO ENTE */}
          <div className="relative group shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-green-500 to-blue-900 p-1 shadow-2xl">
              <div className="w-full h-full rounded-full bg-white p-1 overflow-hidden relative">
                <img
                  src={enteDetails?.profilePicture}
                  alt="Logo Ente"
                  className={`w-full h-full object-cover rounded-full transition duration-300 ${isEditing ? "opacity-50" : ""}`}
                />
                {isEditing && (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10 hover:bg-black/20 transition"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <Icon
                      icon="mdi:camera"
                      className="text-slate-800 text-3xl drop-shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* INFO ENTE */}
          <div className="flex-1 pb-2">
            {isEditing ? (
              <div className="flex flex-col gap-3 animate-fade-in max-w-lg">
                <input
                  type="text"
                  value={enteDetails?.nome}
                  //   onChange={(e) =>
                  //     setEnteInfo({ ...enteDetails, nome: e.target.value })
                  //   }
                  className="text-3xl md:text-4xl font-bold text-secondary border-b-2 border-slate-200 focus:border-primary focus:outline-none bg-transparent w-full pb-1 placeholder:text-slate-300"
                  placeholder="Nome Ente"
                />
                <input
                  type="text"
                  value={enteDetails?.denominazioneSociale}
                  //   onChange={(e) =>
                  //     setEnteInfo({ ...enteInfo, tipo: e.target.value })
                  //   }
                  className="text-slate-500 font-medium text-sm md:text-base border-b border-slate-200 focus:border-primary focus:outline-none bg-transparent w-full pb-1"
                  placeholder="Tipo Ente (es. ODV)"
                />
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-1">
                  {enteDetails?.nome}
                </h1>
                <p className="text-slate-500 font-medium text-sm md:text-base">
                  {enteDetails?.denominazioneSociale}
                </p>
              </>
            )}
          </div>
        </div>

        {/* LAYOUT GRID: Storia + Progetti */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* COLONNA SINISTRA: STORIA (Occupa 2 colonne su schermi larghi) */}
          <div className="lg:col-span-2">
            <h2 className="text-xl md:text-2xl font-bold text-secondary mb-4">
              La nostra storia
            </h2>
            {isEditing ? (
              <textarea
                value={enteDetails?.descrizioneEnte}
                // onChange={(e) =>
                //   setEnteInfo({ ...enteDetails, descrizione: e.target.value })
                // }
                className="w-full h-64 p-4 text-base text-slate-600 border border-slate-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none bg-slate-50 leading-relaxed transition-all"
              />
            ) : (
              <p className="text-slate-600 leading-relaxed text-sm md:text-base text-justify whitespace-pre-wrap">
                {enteDetails?.descrizioneEnte}
              </p>
            )}
          </div>

          {/* COLONNA DESTRA: STATS RAPIDE o INFO AGGIUNTIVE (Opzionale, per riempire spazio) */}
          {/* Per ora lasciamo vuoto o mettiamo i contatti qui in futuro */}
        </div>

        {/* SEZIONE PROGETTI */}
        {enteDetails?.projects && enteDetails.projects.length > 0 && (
          <div className="mt-12 mb-16">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-secondary">
                I progetti
              </h2>
              {/* Mostra "scorri" solo su mobile */}
              <span className="text-xs text-green-600 font-semibold mb-1 mr-1 md:hidden">
                Scorri per vedere →
              </span>
            </div>

            {/* LOGICA RESPONSIVE:
               - Mobile: Flex + Overflow (Carosello)
               - Desktop (md+): Grid (Griglia statica)
            */}
            <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory hide-scrollbar md:overflow-visible md:pb-0">
              {enteDetails?.projects.map((prog) => (
                <div
                  key={prog._id}
                  className="min-w-[85%] sm:min-w-[300px] snap-center first:pl-0 last:pr-6 md:min-w-0 md:last:pr-0"
                >
                  <CardHome {...prog} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full text-center py-8 text-slate-400 text-sm bg-gradient-to-t from-slate-50 to-white border-t border-slate-100 mt-auto">
        ©{new Date().getFullYear()} - Chain4Good
      </footer>
    </div>
  );
}
