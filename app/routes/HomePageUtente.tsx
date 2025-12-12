// app/routes/HomePageUtente.tsx
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import Header from '~/components/Header';

import CardHome from '~/components/CardHome';
import Navbar from '~/components/Navbar'; 

import logo from '~/assets/logo.png'; 
import logoLibersare from '~/assets/libersare.png';
import imgUser from '~/assets/img_user.png'; 

export default function Home() {
  const navigate = useNavigate();
  
  // Stato categoria selezionata
  const [selectedCategory, setSelectedCategory] = useState('medical');

  // MOCK DATA: CATEGORIE
  const categories = [
    { id: 'medical', label: 'Spese mediche', icon: 'icon-park-outline:like' },
    { id: 'education', label: 'Istruzione', icon: 'qlementine-icons:book-16' },
    { id: 'environment', label: 'Ambiente', icon: 'icon-park-outline:tree' },
    { id: 'emergency', label: 'Emergenze', icon: 'material-symbols-light:e911-emergency' },
    { id: 'sport', label: 'Sport', icon: 'fluent:sport-20-regular' },
  ];
  
  // MOCK DATA: PROGETTI
  const projects = [
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
      category: 'environment', // Questo apparirà sotto "Ambiente"
      status: 'attivo' as const, 
      authorId: 102,
      title: "Foresta Urbana: Un polmone verde per la città",
      coverImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
      authorLogo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=200&h=200&q=80",
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
      category: 'education', // Questo apparirà sotto "Istruzione"
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
    },
    {
      id: 4,
      category: 'medical',
      status: 'attivo' as const, 
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
    }
  ];

  // LOGICA FILTRO
  const filteredProjects = projects.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 font-sans">
      <Header type="utente" profileImage={imgUser} />

      {/* BARRA DI RICERCA */}
      <div className="px-6 mb-8">
        <div className="relative">
          <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Cosa vuoi cercare?" 
            className="w-full bg-white text-secondary rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm placeholder-slate-400 font-medium text-sm"
          />
        </div>
      </div>

      {/* IN SCADENZA */}
      <div className="mb-8">
        <h2 className="px-6 text-xl font-bold text-secondary mb-4">In scadenza</h2>
        
        <div className="flex overflow-x-auto px-6 pb-6 gap-5 snap-x snap-mandatory no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {projects.map((project) => (
            <div key={project.id} className="min-w-[85vw] sm:min-w-[320px] snap-center">
              <CardHome {...project} />
            </div>
          ))}
        </div>
      </div>

      {/* SCEGLI PER CATEGORIE */}
      <div className="mb-4">
        <h2 className="px-6 text-xl font-bold text-secondary mb-4">Scegli per categorie</h2>
        
        {/* Chips Categorie Orizzontali */}
        <div className="flex overflow-x-auto px-6 gap-3 pb-4 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
            {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap font-bold text-sm transition-all border
                            ${isActive 
                                ? 'bg-primary text-white shadow-lg shadow-green-500/30 border-transparent' 
                                : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
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

      {/* RISULTATI FILTRATI */}
      <div className="mb-8">
         {filteredProjects.length > 0 ? (
            <div className="flex overflow-x-auto px-6 pb-6 gap-5 snap-x snap-mandatory no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {filteredProjects.map((project) => (
                    <div key={`cat-${project.id}`} className="min-w-[85vw] sm:min-w-[320px] snap-center">
                        <CardHome {...project} />
                    </div>
                ))}
            </div>
         ) : (
            // Messaggio Vuoto
            <div className="px-6 py-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon icon="solar:box-minimalistic-linear" className="text-3xl text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm font-medium">Nessun progetto in questa categoria.</p>
            </div>
         )}
      </div>

      {/* NAVBAR */}
      <Navbar active="home" />
    </div>
  );
}