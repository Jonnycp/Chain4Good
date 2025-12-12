import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

import HeaderCover from '~/components/HeaderCover';
import CardHome from '~/components/CardHome'; 
import coverPlaceholder from '~/assets/cover_event.png';
import logoLibersare from '~/assets/libersare.png'; 

export default function EnteVisibile() {
  const navigate = useNavigate();

  // SIMULAZIONE PERMESSI
  const isEnteLoggato = true; 

  // STATI
  const [isEditing, setIsEditing] = useState(false);
  const [enteInfo, setEnteInfo] = useState({
    nome: "Libersare ODV",
    tipo: "Organizzazione di Volontariato",
    descrizione: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    cover: coverPlaceholder,
    logo: logoLibersare,
  });

  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // HANDLERS
  const handleSave = () => {
    console.log("Dati salvati:", enteInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false); // Reset logica se necessario
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'cover' | 'logo') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setEnteInfo(prev => ({ ...prev, [field]: imageUrl }));
    }
  };

  const progetti = [
    {
      id: 1,
      authorId: 101,
      coverImage: "https://images.unsplash.com/photo-1548504769-900b70ed122e?auto=format&fit=crop&w=800&q=80",
      authorLogo: logoLibersare,
      title: "Rescue Animals’ Second Change Santuario",
      authorName: "Libersare ODV",
      daysLeft: 14,
      currentAmount: 4240310,
      targetAmount: 5300000,
      location: "Bari"
    },
    {
      id: 2,
      authorId: 101,
      title: "Foresta Urbana: Un polmone verde per la città",
      coverImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
      authorLogo: logoLibersare,
      authorName: "Libersare ODV",
      daysLeft: 20,
      currentAmount: 150000,
      targetAmount: 300000,
      location: "Milano"
    },
    {
        id: 3,
        authorId: 101,
        title: "Supporto Digitale Anziani",
        coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
        authorLogo: logoLibersare,
        authorName: "Libersare ODV",
        daysLeft: 5,
        currentAmount: 5000,
        targetAmount: 10000,
        location: "Roma"
      }
  ];

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      
      {/* INPUT FILES */}
      <input type="file" ref={coverInputRef} onChange={(e) => handleImageChange(e, 'cover')} className="hidden" accept="image/*" />
      <input type="file" ref={logoInputRef} onChange={(e) => handleImageChange(e, 'logo')} className="hidden" accept="image/*" />

      {/* HEADER COVER - Full Width */}
      <div className="relative group w-full">
          <HeaderCover
              type={isEnteLoggato ? "ente" : "utente"}
              coverImage={enteInfo.cover}
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
        {isEnteLoggato && (
            <div className="absolute top-4 right-6 z-20">
                {isEditing ? (
                    <div className="flex gap-2 animate-fade-in bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-xl">
                        <button onClick={handleCancel} className="bg-white text-red-500 w-12 h-12 rounded-full shadow-sm flex items-center justify-center hover:bg-red-50 transition border border-red-100">
                            <Icon icon="mdi:close" className="text-2xl" />
                        </button>
                        <button onClick={handleSave} className="bg-primary text-white w-12 h-12 rounded-full shadow-md flex items-center justify-center hover:bg-green-700 transition">
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
                            src={enteInfo.logo} 
                            alt="Logo Ente" 
                            className={`w-full h-full object-cover rounded-full transition duration-300 ${isEditing ? 'opacity-50' : ''}`}
                        />
                        {isEditing && (
                            <div 
                                className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10 hover:bg-black/20 transition"
                                onClick={() => logoInputRef.current?.click()}
                            >
                                <Icon icon="mdi:camera" className="text-slate-800 text-3xl drop-shadow-md" />
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
                            value={enteInfo.nome}
                            onChange={(e) => setEnteInfo({...enteInfo, nome: e.target.value})}
                            className="text-3xl md:text-4xl font-bold text-secondary border-b-2 border-slate-200 focus:border-primary focus:outline-none bg-transparent w-full pb-1 placeholder:text-slate-300"
                            placeholder="Nome Ente"
                        />
                        <input 
                            type="text" 
                            value={enteInfo.tipo}
                            onChange={(e) => setEnteInfo({...enteInfo, tipo: e.target.value})}
                            className="text-slate-500 font-medium text-sm md:text-base border-b border-slate-200 focus:border-primary focus:outline-none bg-transparent w-full pb-1"
                            placeholder="Tipo Ente (es. ODV)"
                        />
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-1">{enteInfo.nome}</h1>
                        <p className="text-slate-500 font-medium text-sm md:text-base">{enteInfo.tipo}</p>
                    </>
                )}
            </div>
        </div>

        {/* LAYOUT GRID: Storia + Progetti */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* COLONNA SINISTRA: STORIA (Occupa 2 colonne su schermi larghi) */}
            <div className="lg:col-span-2">
                <h2 className="text-xl md:text-2xl font-bold text-secondary mb-4">La nostra storia</h2>
                {isEditing ? (
                    <textarea 
                        value={enteInfo.descrizione}
                        onChange={(e) => setEnteInfo({...enteInfo, descrizione: e.target.value})}
                        className="w-full h-64 p-4 text-base text-slate-600 border border-slate-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none bg-slate-50 leading-relaxed transition-all"
                    />
                ) : (
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base text-justify whitespace-pre-wrap">
                        {enteInfo.descrizione}
                    </p>
                )}
            </div>

            {/* COLONNA DESTRA: STATS RAPIDE o INFO AGGIUNTIVE (Opzionale, per riempire spazio) */}
            {/* Per ora lasciamo vuoto o mettiamo i contatti qui in futuro */}
        </div>

        {/* SEZIONE PROGETTI */}
        <div className="mt-12 mb-16">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-secondary">I progetti</h2>
                {/* Mostra "scorri" solo su mobile */}
                <span className="text-xs text-green-600 font-semibold mb-1 mr-1 md:hidden">Scorri per vedere →</span>
            </div>
            
            {/* LOGICA RESPONSIVE:
               - Mobile: Flex + Overflow (Carosello)
               - Desktop (md+): Grid (Griglia statica)
            */}
            <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory hide-scrollbar md:overflow-visible md:pb-0">
                {progetti.map((prog) => (
                    <div key={prog.id} className="min-w-[85%] sm:min-w-[300px] snap-center first:pl-0 last:pr-6 md:min-w-0 md:last:pr-0">
                        <CardHome {...prog} />
                    </div>
                ))}
            </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="w-full text-center py-8 text-slate-400 text-sm bg-gradient-to-t from-slate-50 to-white border-t border-slate-100 mt-auto">
        ©2026 - Chain4Good
      </footer>

    </div>
  );
}