import React from 'react';
import { Icon } from '@iconify/react';
import CardHome from '../components/CardHome';
import Navbar from '../components/Navbar'; 
import logo from '../assets/logo_home.png';
import logoLibersare from '~/assets/libersare.png';

export default function Home() {
  
  const projects = [
    {
      id: 1,
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

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 pt-8 pb-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo Chain4Good" />
           <span className="text-xl font-extrabold text-gray-800 tracking-tight">
             Chain<span className="text-green-600">4</span>Good
           </span>
        </div>
        
        {/* Avatar Utente */}
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
           <Icon icon="solar:user-circle-bold" className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* BARRA DI RICERCA */}
      <div className="px-6 mb-8">
        <div className="relative">
          <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input 
            type="text" 
            placeholder="Cosa vuoi cercare?" 
            className="w-full bg-gray-100 text-gray-700 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 shadow-sm placeholder-gray-400 font-medium"
          />
        </div>
      </div>

      {/* SEZIONE: IN SCADENZA (Carosello) */}
      <div className="mb-8">
        <h2 className="px-6 text-xl font-bold text-gray-800 mb-4">In scadenza</h2>
        
        {/* Container Scrollabile Orizzontale */}
        <div className="flex overflow-x-auto px-6 pb-6 gap-5 snap-x snap-mandatory no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {projects.map((project) => (
            <div key={project.id} className="min-w-[85vw] sm:min-w-[350px] snap-center">
              <CardHome 
                {...project}
              />
            </div>
          ))}
        </div>
      </div>
      <Navbar active="home"/>
    </div>
  );
}