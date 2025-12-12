import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

// Componenti Condivisi
import Header from '~/components/Header';
import Navbar from '~/components/Navbar'; 

// Componenti Specifici (li creo qui sotto)
import CardProgettoAttivo from '~/components/CardProgettoAttivo';
import CardProgettoSupportato from '~/components/CardProgettoSupportato';

import logoLibersare from '~/assets/libersare.png';
import imgUser from '~/assets/img_user.png'; 

export default function Donazioni() {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({
    attivi: true,
    supportati: true 
  });

  const toggleSection = (section: 'attivi' | 'supportati') => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCopyHash = (e: React.MouseEvent, hash: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    alert(`Hash copiato!`);
  };

  // Navigazione
  const goToProject = (id: number) => navigate(`/progetto-singolo/${id}`);
  
  const goToEnte = (e: React.MouseEvent, enteId: number) => {
    e.stopPropagation();
    navigate(`/ente/${enteId}`); // O /profilo-ente se usi la pagina pubblica
  };

  const openMap = (e: React.MouseEvent, location: string) => {
    e.stopPropagation();
    const encoded = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, '_blank');
  };

  // DATI MOCK
  const stats = { progettiSupportati: 3, denaroDonato: 30 };

  const progettiAttivi = [
    {
      id: 1,
      title: "Rescue Animals’ Second Change Santuario",
      cover: "https://images.unsplash.com/photo-1548504769-900b70ed122e?auto=format&fit=crop&w=800&q=80",
      contribution: 157,
      currency: "USDC",
      spentPercentage: 15,
      badgeCount: 3
    },
    {
      id: 2,
      title: "Foresta Urbana Milano",
      cover: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
      contribution: 50,
      currency: "USDC",
      spentPercentage: 45,
      badgeCount: 1
    }
  ];

  const progettiSupportati = [
    {
      id: 1,
      enteId: 101,
      title: "Rescue Animals’ Second Change Santuario",
      location: "Bari",
      cover: "https://images.unsplash.com/photo-1548504769-900b70ed122e?auto=format&fit=crop&w=800&q=80",
      logoEnte: logoLibersare,
      percent: 80,
      daysLeft: 14,
      supporters: 10,
      donations: [
        { id: 'tx1', amount: 157, currency: 'USDC', date: '10/10/2025 - 12.34', hash: '0x75df0e14e35689...' },
        { id: 'tx2', amount: 12, currency: 'USDC', date: '10/10/2025 - 12.34', hash: '0x32ac9b12f41231...' },
      ]
    },
    {
      id: 2,
      enteId: 101,
      title: "Tech Lab per le scuole elementari",
      location: "Roma",
      cover: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      logoEnte: logoLibersare,
      percent: 45,
      daysLeft: 30,
      supporters: 5,
      donations: [
        { id: 'tx3', amount: 50, currency: 'USDC', date: '12/10/2025 - 09.00', hash: '0x99df0e14e356...' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans pb-28">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* HEADER */}
      <Header type="utente" profileImage={imgUser} />

      {/* MAIN CONTENT (Centrato per desktop) */}
      <main className="px-6 mt-2 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-extrabold text-secondary mb-6">Le tue donazioni</h1>

        {/* STATS */}
        <div className="flex gap-4 mb-8">
            <div className="flex-1 border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm bg-slate-50">
                <span className="text-4xl font-extrabold text-primary">{stats.progettiSupportati}</span>
                <span className="text-xs font-bold text-secondary text-right leading-tight">Progetti<br/>supportati</span>
            </div>

            <div className="flex-1 border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm bg-slate-50">
                <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold text-primary">{stats.denaroDonato}</span>
                    <span className="text-sm font-bold text-primary ml-0.5">ETH</span>
                </div>
                <span className="text-xs font-bold text-secondary text-right leading-tight">Denaro<br/>donato</span>
            </div>
        </div>

        {/* PROGETTI ATTIVI */}
        <div className="mb-8">
            <div 
                className="flex items-center justify-between mb-4 cursor-pointer group"
                onClick={() => toggleSection('attivi')}
            >
                <h2 className="text-lg font-bold text-secondary">Progetti attivi</h2>
                <Icon icon="mdi:chevron-down" className={`text-2xl text-secondary transition-transform duration-300 ${openSections.attivi ? 'rotate-180' : ''}`} />
            </div>

            {openSections.attivi && (
                <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x snap-mandatory no-scrollbar">
                    {progettiAttivi.map((item) => (
                        <div key={item.id} className="min-w-[85vw] sm:min-w-[320px] snap-center">
                            <CardProgettoAttivo {...item} onClick={() => goToProject(item.id)} />
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* PROGETTI SUPPORTATI */}
        <div className="mb-6">
            <div 
                className="flex items-center justify-between mb-4 cursor-pointer group"
                onClick={() => toggleSection('supportati')}
            >
                <h2 className="text-lg font-bold text-secondary">Progetti supportati</h2>
                <Icon icon="mdi:chevron-down" className={`text-2xl text-secondary transition-transform duration-300 ${openSections.supportati ? 'rotate-180' : ''}`} />
            </div>

            {openSections.supportati && (
                <div className="flex flex-col gap-6">
                    {progettiSupportati.map((project) => (
                        <CardProgettoSupportato 
                            key={project.id}
                            {...project}
                            userAvatar={imgUser}
                            onProjectClick={() => goToProject(project.id)}
                            onEnteClick={(e) => goToEnte(e, project.enteId)}
                            onMapClick={(e) => openMap(e, project.location)}
                            onCopyHash={handleCopyHash}
                        />
                    ))}
                </div>
            )}
        </div>

      </main>

      <Navbar active="donazioni" />
    </div>
  );
}