import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

import Navbar from '~/components/Navbar'; 
import CardProgettoAttivo from '~/components/CardProgettoAttivo';
import CardProgettoSupportato from '~/components/CardProgettoSupportato';

import logo from '~/assets/logo.png'; 
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

  // LOGICA COPY HASH
  const handleCopyHash = (e: React.MouseEvent, hash: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    alert(`Hash transazione copiato: ${hash.substring(0, 10)}...`);
  };

  // LOGICA NAVIGAZIONE
  const goToProject = (id: number) => navigate(`/progetto-singolo-utente`);
  // const goToProject = (id: number) => navigate(`/progetto-singolo-utente-attivo/${id}`);
    const goToProjectUtente = (id: number) => navigate(`/progetto-singolo-voto-utente`);
  // const goToProject = (id: number) => navigate(`/progetto-singolo-utente-attivo/${id}`);
  
  const goToEnte = (e: React.MouseEvent, enteId: number) => {
    e.stopPropagation();
    navigate(`/ente/${enteId}`);
  };

  const openMap = (e: React.MouseEvent, location: string) => {
    e.stopPropagation();
    window.open(`https://www.google.com/maps/search/?api=1&query=${location}`, '_blank');
  };

  // DATI MOCK
  const stats = {
    progettiSupportati: 3,
    denaroDonato: 30
  };

  // Progetti Attivi
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

  // Progetti Supportati
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
        { id: 'tx1', amount: 157, currency: 'USDC', date: '10/10/2025 alle 12.34 CET', hash: '0x75df0e14e35689...' },
        { id: 'tx2', amount: 12, currency: 'USDC', date: '10/10/2025 alle 12.34 CET', hash: '0x32ac9b12f41231...' },
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
        { id: 'tx3', amount: 50, currency: 'USDC', date: '12/10/2025 alle 09.00 CET', hash: '0x99df0e14e356...' },
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
      <div className="flex justify-between items-center px-6 pt-8 pb-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo Chain4Good" className="h-7 w-auto object-contain" />
           <span className="text-xl font-extrabold text-secondary tracking-tight">
             Chain<span className="text-primary">4</span>Good
           </span>
        </div>
        
        {/* Avatar Utente */}
        <div 
            onClick={() => navigate('/profilo-utente')}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border border-primary cursor-pointer overflow-hidden">
           <img src={imgUser} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      <main className="px-6 mt-2">
        <h1 className="text-2xl font-extrabold text-secondary mb-6">Le tue donazioni</h1>

        {/* CARD STATISTICHE */}
        <div className="flex gap-4 mb-8">
            <div className="flex-1 border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <span className="text-4xl font-extrabold text-primary">{stats.progettiSupportati}</span>
                <span className="text-xs font-bold text-secondary text-right leading-tight">Progetti<br/>supportati</span>
            </div>

            <div className="flex-1 border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold text-primary">{stats.denaroDonato}</span>
                    <span className="text-sm font-bold text-primary ml-0.5">ETH</span>
                </div>
                <span className="text-xs font-bold text-secondary text-right leading-tight">Denaro<br/>donato</span>
            </div>
        </div>

        {/* SEZIONE: PROGETTI ATTIVI (CAROSELLO) */}
        <div className="mb-8">
            <div 
                className="flex items-center justify-between mb-4 cursor-pointer group"
                onClick={() => toggleSection('attivi')}
            >
                <h2 className="text-lg font-bold text-secondary">Progetti attivi</h2>
                <Icon 
                    icon="mdi:chevron-down" 
                    className={`text-2xl text-secondary transition-transform duration-300 ${openSections.attivi ? 'rotate-180' : ''}`} 
                />
            </div>

            {/* Carosello Progetti Attivi */}
            {openSections.attivi && (
                <div className="flex overflow-x-auto px-6 pb-6 gap-4 snap-x snap-mandatory -mx-6 no-scrollbar">
                    {progettiAttivi.map((item) => (
                        <div key={item.id} className="min-w-[85vw] sm:min-w-[320px] snap-center">
                            <CardProgettoAttivo 
                                {...item}
                                onClick={() => goToProjectUtente(item.id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* SEZIONE: PROGETTI SUPPORTATI */}
        <div className="mb-6">
            <div 
                className="flex items-center justify-between mb-4 cursor-pointer group"
                onClick={() => toggleSection('supportati')}
            >
                <h2 className="text-lg font-bold text-secondary">Progetti supportati</h2>
                <Icon 
                    icon="mdi:chevron-down" 
                    className={`text-2xl text-secondary transition-transform duration-300 ${openSections.supportati ? 'rotate-180' : ''}`} 
                />
            </div>

            {/* Carosello Progetti Supportati */}
            {openSections.supportati && (
                <div className="flex overflow-x-auto px-6 pb-6 gap-5 snap-x snap-mandatory -mx-6 no-scrollbar">
                    {progettiSupportati.map((project) => (
                        <div key={project.id} className="min-w-[90vw] sm:min-w-[350px] snap-center">
                            <CardProgettoSupportato 
                                {...project}
                                userAvatar={imgUser}
                                onProjectClick={() => goToProject(project.id)}
                                onEnteClick={(e) => goToEnte(e, project.enteId)}
                                onMapClick={(e) => openMap(e, project.location)}
                                onCopyHash={handleCopyHash}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>

      </main>

      <Navbar active="donazioni" />
    </div>
  );
}