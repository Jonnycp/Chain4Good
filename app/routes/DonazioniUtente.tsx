import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

import Header from '~/components/Header';
import Navbar from '~/components/Navbar'; 

import CardProgettoAttivo, { CardProgettoAttivoSkeleton } from '~/components/CardProgettoAttivo';
import CardProgettoSupportato, { CardProgettoSupportatoSkeleton } from '~/components/CardProgettoSupportato';
import { useApp } from '~/context/AppProvider';


export default function Donazioni() {
  const navigate = useNavigate();
  const {user, loading, statsDonations} = useApp();
  const loadingState = loading.statsDonations || loading.user;

  const [openSections, setOpenSections] = useState({
    attivi: true,
    supportati: true 
  });

  const toggleSection = (section: 'attivi' | 'supportati') => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };


  return (
    <div className="min-h-screen bg-white font-sans pb-28">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* HEADER */}
      <Header 
        type={user?.isEnte ? 'ente' : 'utente'}
        profileImage={user?.profilePicture || ""} 
        activePage="donazioni"
      />

      {/* MAIN CONTENT */}
      <main className="px-6 mt-2 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-extrabold text-secondary mb-6">Le tue donazioni</h1>

        {/* STATS */}
        <div className="flex gap-4 mb-8">
            <div className="flex-1 border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm bg-slate-50">
                <span className="text-4xl font-extrabold text-primary">{statsDonations?.stats.progettiSupportati || 0}</span>
                <span className="text-xs font-bold text-secondary text-right leading-tight">Progetti<br/>supportati</span>
            </div>

            <div className="flex-1 border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm bg-slate-50">
                <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold text-primary">{statsDonations?.stats.denaroDonato || 0}</span>
                    <span className="text-sm font-bold text-primary ml-0.5">EURC</span> {/* 
                    //TODO: support altre valute
                    */}
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

                <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x snap-mandatory no-scrollbar">
                    {!loadingState && statsDonations ? statsDonations.progettiAttivi.map((item) => (
                        <div key={item._id + "-attivo"} className="min-w-[85vw] sm:min-w-[320px] snap-center">
                            <CardProgettoAttivo {...item} />
                        </div>
                    )) : (
                      <>
                        <div className="min-w-[85vw] sm:min-w-[320px] snap-center">
                          <CardProgettoAttivoSkeleton />
                        </div>
                        <div className="min-w-[85vw] sm:min-w-[320px] snap-center">
                          <CardProgettoAttivoSkeleton />
                        </div>
                      </>
                    )}
                </div>
            
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

                <div className="flex flex-col gap-6">
                    {!loadingState && statsDonations ? statsDonations.progettiSupportati.map((project) => (
                        <CardProgettoSupportato 
                            key={project._id + "-supportato"}
                            {...project}
                        />
                    )) : (
                      <>
                        <CardProgettoSupportatoSkeleton />
                      </>
                    )}
                </div>
        </div>

      </main>

      <Navbar active="donazioni" />
    </div>
  );
}