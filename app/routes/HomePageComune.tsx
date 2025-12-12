import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Button } from "@heroui/react";
import { useNavigate } from 'react-router-dom';

// Componenti Condivisi
import Header from '~/components/Header';
import CardHome from '~/components/CardHome';
import Navbar from '~/components/Navbar'; 

// Assets
import logoChain4Good from '~/assets/logo.png'; 
import logoLibersare from '~/assets/libersare.png';
import imgUser from '~/assets/img_user.png'; 

export default function HomePage() {
  const navigate = useNavigate();

  // CONTROLLO RUOLO
  const isEnte = false

  // DATI & STATO UTENTE
  const [selectedCategory, setSelectedCategory] = useState('medical');

  const categories = [
    { id: 'medical', label: 'Spese mediche', icon: 'icon-park-outline:like' },
    { id: 'education', label: 'Istruzione', icon: 'qlementine-icons:book-16' },
    { id: 'environment', label: 'Ambiente', icon: 'icon-park-outline:tree' },
    { id: 'emergency', label: 'Emergenze', icon: 'material-symbols-light:e911-emergency' },
    { id: 'sport', label: 'Sport', icon: 'fluent:sport-20-regular' },
  ];

  // Dati Ente (Profilo)
  const enteProfile = {
    nome: "Libersare ODV",
    logo: logoLibersare
  };

  // MOCK DATA PROGETTI
  const allProjects = [
    {
      id: 1,
      category: 'medical',
      status: 'raccolta' as const,
      authorId: 101,
      coverImage: "https://images.unsplash.com/photo-1548504769-900b70ed122e?auto=format&fit=crop&w=800&q=80",
      authorLogo: logoLibersare,
      title: "Rescue Animals’ Second Change Santuario",
      authorName: "Libersare ODV",
      daysLeft: 14,
      currentAmount: 4240310,
      targetAmount: 5300000,
      location: "Bari",
      currency: "ETH"
    },
    {
      id: 2,
      category: 'environment',
      status: 'attivo' as const, 
      authorId: 102,
      title: "Foresta Urbana: Un polmone verde per la città",
      coverImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
      authorLogo: logoLibersare,
      authorName: "Green Future",
      location: "Milano",
      currentAmount: 12500,
      currency: "USDC",
      spentPercentage: 45, 
      expensesCount: 12,
      donorsCount: 230
    },
    {
      id: 3,
      category: 'education',
      status: 'raccolta' as const,
      authorId: 103,
      title: "Tech Lab per le scuole elementari",
      coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      authorLogo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=200&h=200&q=80",
      authorName: "EduTech Italia",
      daysLeft: 30,
      currentAmount: 4500,
      targetAmount: 15000,
      location: "Roma",
      currency: "ETH"
    }
  ];

  // Filtri
  const filteredProjectsUser = allProjects.filter(p => p.category === selectedCategory);
  
  const enteProjects = allProjects.slice(0, 2); 

  const handleProjectClick = (id: number) => {
    navigate(`/progetto-singolo`);
    //navigate(`/progetto-singolo/${id}`);
  };

  return (
    <div className={`min-h-screen font-sans relative transition-colors ${isEnte ? 'bg-gray-50 pb-20' : 'bg-[#F8FAFC] pb-28 md:pb-10'}`}>
      
      {/* HEADER DINAMICO */}
      <Header 
        type={isEnte ? "ente" : "utente"} 
        profileImage={isEnte ? enteProfile.logo : imgUser} 
        activePage="home"
      />

      <div className="w-full max-w-7xl mx-auto">

        {/* BARRA DI RICERCA (Comune a entrambi) */}
        <div className="px-6 mb-8 md:mb-10 md:flex md:justify-center">
            <div className="relative w-full md:w-1/2 lg:w-1/3">
            <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
                type="text" 
                placeholder="Cerca progetti..." 
                className="w-full bg-white text-secondary rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm placeholder-gray-400 font-medium text-sm border border-transparent focus:border-primary"
            />
            </div>
        </div>

        {/* CONTENUTO CONDIZIONALE */}
        {isEnte ? (
            
            // VISTA ENTE (RESPONSIVE)
            <div className="px-6 md:px-12">
               
               {/* Titolo + Bottone Desktop */}
               <div className="flex items-center justify-between mb-6 md:mb-8">
                  <h1 className="text-xl md:text-2xl font-bold text-secondary">
                    I tuoi progetti
                  </h1>
                  
                  {/* Bottone visibile solo su Desktop per creare progetto */}
                  <Button 
                    className="hidden md:flex bg-primary text-white font-bold rounded-xl px-6 shadow-md hover:bg-green-600 transition"
                    onPress={() => navigate('/nuovo-progetto')}
                  >
                    <Icon icon="mdi:plus" className="w-5 h-5 mr-1" />
                    Nuovo Progetto
                  </Button>
               </div>

               {/* GRIGLIA PROGETTI ENTE */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {enteProjects.length > 0 ? (
                    enteProjects.map((progetto) => (
                        <div key={progetto.id} onClick={() => handleProjectClick(progetto.id)} className="cursor-pointer transition-transform hover:-translate-y-1">
                            <CardHome {...progetto} />
                        </div>
                    ))
                 ) : (
                    // Empty State Ente
                    <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                           <Icon icon="solar:folder-with-files-linear" className="text-3xl text-slate-400" />
                        </div>
                        <p className="text-slate-500 font-medium">Non hai ancora creato progetti.</p>
                        <button 
                            className="mt-4 text-primary font-bold text-sm underline"
                            onClick={() => navigate('/nuovo-progetto')}
                        >
                            Crea il primo ora
                        </button>
                    </div>
                 )}
               </div>

               {/* Footer Ente */}
               <div className="mt-12 text-center text-gray-400 text-sm pb-8">
                 © 2026 - Chain4Good Dashboard
               </div>

               {/* FAB (Floating Action Button) - Visibile solo su MOBILE/TABLET */}
               <div className="fixed bottom-6 right-4 z-30 md:hidden">
                <Button 
                    className="bg-primary text-white font-bold shadow-lg shadow-green-500/30 rounded-full w-14 h-14 min-w-0 p-0 flex items-center justify-center hover:bg-green-600 transition"
                    onPress={() => navigate('/nuovo-progetto')}
                >
                    <Icon icon="mdi:plus" className="w-8 h-8" />
                </Button>
              </div>
            </div>

        ) : (

            // VISTA UTENTE (RESPONSIVE)
            <>
            {/* Sezione: In scadenza */}
            <div className="mb-10">
                <h2 className="px-6 text-xl font-bold text-secondary mb-4 md:mb-6 md:px-12">Explore Projects</h2>
                
                <div className="
                    flex overflow-x-auto px-6 pb-6 gap-5 snap-x snap-mandatory no-scrollbar 
                    md:grid md:grid-cols-2 lg:grid-cols-3 md:px-12 md:overflow-visible
                " style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    
                    {allProjects.map((project) => (
                        <div 
                            key={project.id} 
                            className="min-w-[85vw] sm:min-w-[320px] snap-center md:min-w-0 cursor-pointer" 
                            onClick={() => handleProjectClick(project.id)}
                        >
                            <CardHome {...project} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Categorie */}
            <div className="mb-8">
                <div className="flex items-center justify-between px-6 md:px-12 mb-4">
                    <h2 className="text-xl font-bold text-secondary">Categorie</h2>
                </div>

                <div className="
                    flex overflow-x-auto px-6 gap-3 pb-4 no-scrollbar
                    md:px-12 md:flex-wrap
                " style={{ scrollbarWidth: 'none' }}>
                    {categories.map((cat) => {
                        const isActive = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap font-bold text-sm transition-all border
                                    ${isActive 
                                        ? 'bg-primary text-white shadow-lg shadow-green-500/30 border-transparent' 
                                        : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                                    }
                                `}
                            >
                                <Icon icon={cat.icon} className="text-lg" />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Risultati Filtrati */}
            <div className="mb-8">
                {filteredProjectsUser.length > 0 ? (
                    <div className="
                        flex overflow-x-auto px-6 pb-6 gap-5 snap-x snap-mandatory no-scrollbar
                        md:grid md:grid-cols-2 lg:grid-cols-3 md:px-12 md:overflow-visible
                    " style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {filteredProjectsUser.map((project) => (
                            <div key={`cat-${project.id}`} className="min-w-[85vw] sm:min-w-[320px] snap-center md:min-w-0 cursor-pointer" onClick={() => handleProjectClick(project.id)}>
                                <CardHome {...project} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-6 py-12 text-center md:bg-white md:mx-12 md:rounded-3xl">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Icon icon="solar:box-minimalistic-linear" className="text-3xl text-slate-400" />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Nessun progetto trovato in questa categoria.</p>
                    </div>
                )}
            </div>

            {/* Navbar Mobile (Solo per Utente) */}
            <Navbar active="home" />
            </>
        )}
      </div>
    </div>
  );
}