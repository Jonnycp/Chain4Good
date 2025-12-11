import React from 'react';
import { Icon } from '@iconify/react';
import { Button } from "@heroui/react";
import { useNavigate } from 'react-router-dom';

import CardHome from '~/components/CardHome'; 
import Navbar from '~/components/Navbar'; 
import logoChain4Good from '~/assets/logo.png'; 
import logoLibersare from '~/assets/libersare.png';

export default function HomeEnte() {
  const navigate = useNavigate();

  const enteData = {
    nome: "Libersare ODV",
    logo: logoLibersare
  };

  const progetti = [
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
      authorId: 101,
      coverImage: "https://images.unsplash.com/photo-1548504769-900b70ed122e?auto=format&fit=crop&w=800&q=80", 
      authorLogo: logoLibersare,
      title: "Rescue Animals’ Second Change Santuario",
      authorName: "Libersare ODV",
      location: "Bari",
      currentAmount: 157,
      currency: "USDC",
      spentPercentage: 10,
      expensesCount: 14,
      donorsCount: 124
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-32 relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 pt-8 pb-4">
        {/* Logo Chain4Good */}
        <div className="flex items-center gap-2">
            <img src={logoChain4Good} alt="Chain4Good Logo" className="h-8" />
            <div className="flex items-center font-bold text-xl text-secondary">
                Chain<span className="text-primary">4</span>Good
            </div>
        </div>
        
        {/* Avatar Ente */}
        <div 
            onClick={() => navigate('/profilo-ente')}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-blue-900 p-[2px] cursor-pointer"
        >
           <div className="w-full h-full rounded-full bg-white p-[1px] overflow-hidden">
                <img src={enteData.logo} alt="Profile" className="w-full h-full object-cover rounded-full" />
           </div>
        </div>
      </div>

      {/* BARRA DI RICERCA */}
      <div className="px-6 mb-6">
        <div className="relative">
          <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Cosa vuoi cercare?" 
            className="w-full bg-gray-100 text-secondary rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm placeholder-gray-400 font-medium text-sm"
          />
        </div>
      </div>

      {/* TITOLO */}
      <h1 className="px-6 text-xl font-bold text-secondary mb-5">I tuoi progetti</h1>

      {/* LISTA PROGETTI */}
      <div className="px-6 flex flex-col gap-6">
        {progetti.map((progetto) => (
            <CardHome 
                key={progetto.id} 
                {...progetto} 
            />
        ))}
      </div>

      {/* FOOTER COPYRIGHT */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        ©2026 - Chain4Good
      </div>

      {/* FAB: NUOVO PROGETTO */}
      <div className="fixed bottom-24 right-4 z-30">
        <Button 
            className="bg-primary text-white font-bold shadow-lg shadow-green-500/30 rounded-full px-6 py-6 flex items-center gap-2"
            onPress={() => navigate('/nuovo-progetto')}
        >
            <Icon icon="mdi:plus" className="w-6 h-6" />
            Nuovo <br/> progetto
        </Button>
      </div>
      <Navbar active="home" />
    </div>
  );
}