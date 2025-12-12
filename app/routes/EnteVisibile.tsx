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
  // simulo ente
  const isEnteLoggato = true; 
  // simulo utente
  //const isEnteLoggato = false;

  // STATI PER LA MODIFICA
  const [isEditing, setIsEditing] = useState(false);
  
  // Stato dei dati dell'ente (inizializzato con i dati mock)
  const [enteInfo, setEnteInfo] = useState({
    nome: "Libersare ODV",
    tipo: "Organizzazione di Volontariato",
    descrizione: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    cover: coverPlaceholder,
    logo: logoLibersare,
  });

  // Refs per gli input file (nascosti)
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // HANDLERS
  const handleSave = () => {
    // Qui faresti la chiamata API per salvare i dati
    console.log("Dati salvati:", enteInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Logica di reset (opzionale: ricaricare i dati originali)
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'cover' | 'logo') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file); // Crea URL temporaneo per preview
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
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans pb-10 relative">
      
      {/* INPUT FILES NASCOSTI */}
      <input type="file" ref={coverInputRef} onChange={(e) => handleImageChange(e, 'cover')} className="hidden" accept="image/*" />
      <input type="file" ref={logoInputRef} onChange={(e) => handleImageChange(e, 'logo')} className="hidden" accept="image/*" />

      {/* HEADER COVER + Pulsante Modifica Cover */}
      <div className="relative group">
          <HeaderCover
              type={isEnteLoggato ? "ente" : "utente"}
              coverImage={enteInfo.cover}
              onShare={() => console.log("Share")}
              onDelete={() => console.log("Delete")}
          />
          
          {/* Overlay cambio cover (Solo se in editing) */}
          {isEditing && (
              <button 
                onClick={() => coverInputRef.current?.click()}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-black/70 transition backdrop-blur-sm border border-white/20"
              >
                  <Icon icon="mdi:camera" /> Modifica Copertina
              </button>
          )}
      </div>

      {/* STYLE SCROLLBAR */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* CONTENUTO PRINCIPALE */}
      <main className="max-w-md mx-auto px-6 relative z-10 -mt-16">
        
        {/* BARRA AZIONI MODIFICHE */}
        {isEnteLoggato && (
            <div className="absolute top-0 right-6 z-20">
                {isEditing ? (
                    <div className="flex gap-2 animate-fade-in">
                        <button onClick={handleCancel} className="bg-white text-red-500 w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition">
                            <Icon icon="mdi:close" className="text-xl" />
                        </button>
                        <button onClick={handleSave} className="bg-primary text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition">
                            <Icon icon="mdi:check" className="text-xl" />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="bg-white text-secondary w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition"
                    >
                        <Icon icon="mdi:pencil" className="text-xl" />
                    </button>
                )}
            </div>
        )}

        {/* LOGO ENTE */}
        <div className="mb-4 relative inline-block">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-green-500 to-blue-900 p-1 shadow-xl relative group">
                <div className="w-full h-full rounded-full bg-white p-1 overflow-hidden relative">
                    <img 
                        src={enteInfo.logo} 
                        alt="Logo Ente" 
                        className={`w-full h-full object-cover rounded-full transition ${isEditing ? 'opacity-50' : ''}`}
                    />
                    
                    {/* Overlay Cambio Logo */}
                    {isEditing && (
                        <div 
                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                            onClick={() => logoInputRef.current?.click()}
                        >
                             <Icon icon="mdi:camera" className="text-slate-700 text-3xl" />
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* INFO ENTE (Form vs Testo) */}
        <div className="mb-8">
            {isEditing ? (
                <div className="flex flex-col gap-2 animate-fade-in">
                    <input 
                        type="text" 
                        value={enteInfo.nome}
                        onChange={(e) => setEnteInfo({...enteInfo, nome: e.target.value})}
                        className="text-3xl font-bold text-secondary border-b-2 border-slate-200 focus:border-primary focus:outline-none bg-transparent w-full pb-1"
                        placeholder="Nome Ente"
                    />
                    <input 
                        type="text" 
                        value={enteInfo.tipo}
                        onChange={(e) => setEnteInfo({...enteInfo, tipo: e.target.value})}
                        className="text-slate-500 font-medium text-sm border-b border-slate-200 focus:border-primary focus:outline-none bg-transparent w-full pb-1"
                        placeholder="Tipo Ente (es. ODV)"
                    />
                </div>
            ) : (
                <>
                    <h1 className="text-3xl font-bold text-secondary mb-1">{enteInfo.nome}</h1>
                    <p className="text-slate-500 font-medium text-sm">{enteInfo.tipo}</p>
                </>
            )}
        </div>

        {/* SEZIONE STORIA */}
        <div className="mb-8">
            <h2 className="text-xl font-bold text-secondary mb-3">La nostra storia</h2>
            {isEditing ? (
                <textarea 
                    value={enteInfo.descrizione}
                    onChange={(e) => setEnteInfo({...enteInfo, descrizione: e.target.value})}
                    className="w-full h-40 p-3 text-sm text-slate-600 border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none bg-slate-50 leading-relaxed"
                />
            ) : (
                <p className="text-slate-600 leading-relaxed text-sm text-justify whitespace-pre-wrap">
                    {enteInfo.descrizione}
                </p>
            )}
        </div>

        {/* SEZIONE PROGETTI */}
        <div className="mb-12">
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-bold text-secondary">I progetti</h2>
                <span className="text-xs text-green-600 font-semibold mb-1 mr-1">Scorri per vedere →</span>
            </div>
            
            <div className="flex overflow-x-auto gap-4 pb-8 -mx-6 px-6 snap-x snap-mandatory hide-scrollbar">
                {progetti.map((prog) => (
                    <div key={prog.id} className="min-w-[85%] sm:min-w-[300px] snap-center first:pl-0 last:pr-6">
                        <CardHome {...prog} />
                    </div>
                ))}
            </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="w-full text-center py-6 text-slate-400 text-sm bg-gradient-to-t from-slate-50 to-white">
        ©2026 - Chain4Good
      </footer>

    </div>
  );
}