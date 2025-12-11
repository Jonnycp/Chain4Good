import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@heroui/react";

import CardHome from '~/components/CardHome'; 
import coverPlaceholder from '~/assets/cover_event.png';
import logoLibersare from '~/assets/libersare.png'; 

export default function EnteVisibile() {
  const navigate = useNavigate();

  // Dati simulati per l'ente
  const enteInfo = {
    nome: "Libersare ODV",
    tipo: "Organizzazione di Volontariato",
    descrizione: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    cover: coverPlaceholder,
    logo: logoLibersare,
  };

  // Dati simulati per le Card
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
    <div className="min-h-screen bg-white font-sans pb-10 relative">
      
      {/* Stile inline per nascondere la scrollbar nativa ma mantenere lo scroll funzionale */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* --- HEADER CON IMMAGINE DI COPERTINA --- */}
      <div className="relative h-64 w-full">
        {/* Immagine */}
        <img 
          src={enteInfo.cover} 
          alt="Cover Ente" 
          className="w-full h-full object-cover"
        />
        {/* Overlay scuro leggero */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent h-24 pointer-events-none" />

        {/* Pulsanti Navigazione */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20">
            <Button 
                isIconOnly 
                variant="ghost" 
                className="text-white hover:bg-white/20 rounded-full"
                onPress={() => navigate(-1)}
            >
                <Icon icon="mdi:arrow-left" width="28" />
            </Button>

            <Button 
                isIconOnly 
                variant="ghost" 
                className="text-white hover:bg-white/20 rounded-full"
            >
                <Icon icon="mdi:share-variant-outline" width="26" />
            </Button>
        </div>
      </div>

      {/* --- CONTENUTO PRINCIPALE --- */}
      <main className="max-w-md mx-auto px-6 relative z-10 -mt-16">
        
        {/* LOGO ENTE (Sovrapposto) */}
        <div className="mb-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-green-500 to-blue-900 p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-white p-1 overflow-hidden">
                    <img 
                        src={enteInfo.logo} 
                        alt="Logo Ente" 
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
            </div>
        </div>

        {/* INFO ENTE */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary mb-1">
                {enteInfo.nome}
            </h1>
            <p className="text-slate-500 font-medium text-sm">
                {enteInfo.tipo}
            </p>
        </div>

        {/* SEZIONE STORIA */}
        <div className="mb-8">
            <h2 className="text-xl font-bold text-secondary mb-3">
                La nostra storia
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm text-justify">
                {enteInfo.descrizione}
            </p>
        </div>

        {/* SEZIONE PROGETTI (CAROSELLO) */}
        <div className="mb-12">
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-bold text-secondary">
                    I progetti
                </h2>
                <span className="text-xs text-green-600 font-semibold mb-1 mr-1">
                    Scorri per vedere →
                </span>
            </div>
            
            {/* Carosello Orizzontale:
               - -mx-6 px-6: Espande il contenitore ai bordi dello schermo mantenendo il padding interno iniziale
               - overflow-x-auto: Abilita lo scroll
               - snap-x: Abilita lo snapping
            */}
            <div className="flex overflow-x-auto gap-4 pb-8 -mx-6 px-6 snap-x snap-mandatory hide-scrollbar">
                {progetti.map((prog) => (
                    // Wrapper per definire la larghezza della card nel carosello
                    <div 
                        key={prog.id} 
                        className="min-w-[85%] sm:min-w-[300px] snap-center first:pl-0 last:pr-6"
                    >
                        <CardHome {...prog} />
                    </div>
                ))}
            </div>
        </div>

      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full text-center py-6 text-slate-400 text-sm bg-gradient-to-t from-slate-50 to-white">
        ©2026 - Chain4Good
      </footer>

    </div>
  );
}