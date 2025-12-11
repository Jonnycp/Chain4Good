import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { 
  Button, 
  Card
} from "@heroui/react";

import logoChain4Good from '~/assets/logo.png'; 
import avatarPlaceholder from '~/assets/libersare.png';
import Navbar from '~/components/Navbar';

export default function ProfiloEnte() {
  const navigate = useNavigate();

  const [datiEnte] = useState({
    nome: "Rose",
    walletAddress: "0x75df0e14e35689...", 
    saldo: "300.001",
    denominazione: "Organizzazione di volontariato",
    email: "rose_random@gmail.com",
    avatar: avatarPlaceholder
  });

  const handleLogout = () => {
    console.log("Disconnessione in corso...");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-secondary font-sans pb-24 relative">
      
      {/* HEADER */}
      <header className="p-4 flex justify-between items-center max-w-md mx-auto">
        <div className="flex items-center gap-2">
            <img src={logoChain4Good} alt="Chain4Good Logo" className="h-8" />
            <div className="flex items-center font-bold text-xl text-secondary">
                Chain<span className="text-primary">4</span>Good
            </div>
        </div>
        <Button isIconOnly variant="ghost" className="rounded-full">
          <Icon icon="mdi:cog" width="28" className="text-secondary" />
        </Button>
      </header>

      {/* CONTENUTO PRINCIPALE */}
      <main className="max-w-md mx-auto px-6 mt-2">
        
        <h1 className="text-2xl font-bold text-secondary mb-6">Il tuo profilo</h1>

        {/* SEZIONE AVATAR */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-green-500 p-1">
                <img 
                    src={datiEnte.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover rounded-full" 
                />
            </div>
            
            <button 
              className="absolute bottom-1 right-1 bg-green-600 text-white rounded-full p-2 border-2 border-white shadow-md flex items-center justify-center hover:bg-green-700 transition"
            >
              <Icon icon="mdi:plus" width="20" />
            </button>
          </div>
          <Button variant="ghost" className="mt-2 text-slate-600 hover:text-primary font-medium">
            Modifica immagine o avatar
          </Button>
        </div>

        {/* CARD WALLET */}
        <Card className="border border-slate-200 shadow-sm mb-8 bg-white rounded-xl">
          <div className="p-6 text-center overflow-hidden">
            <p className="text-slate-600 font-medium mb-1">Nel wallet hai disponibili</p>
            <div className="text-4xl font-bold text-primary flex justify-center items-baseline gap-1">
              {datiEnte.saldo} <span className="text-lg text-green-700 font-semibold">ETH</span>
            </div>
          </div>
        </Card>

        {/* CAMPI INFORMAZIONI */}
        <div className="space-y-6">
          
          {/* NOME ENTE */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-secondary text-sm ml-1">Nome ente</label>
            <div className="flex items-center bg-gray-100 rounded-xl px-3 h-14 hover:bg-gray-200 transition-colors">
                <Icon icon="lucide:user-round" className="text-2xl text-slate-400 mr-2 flex-shrink-0" />
                <input 
                  readOnly 
                  value={datiEnte.nome} 
                  className="bg-transparent w-full outline-none text-slate-700 font-medium"
                />
            </div>
          </div>

          {/* WALLET */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-secondary text-sm ml-1">Wallet</label>
            <div className="flex items-center bg-gray-100 rounded-xl px-3 h-14 hover:bg-gray-200 transition-colors">
                <Icon icon="mdi:link-variant" className="text-2xl text-slate-400 mr-2 flex-shrink-0" />
                <input 
                  readOnly 
                  value={datiEnte.walletAddress} 
                  className="bg-transparent w-full outline-none text-slate-700 font-medium text-xs truncate"
                />
            </div>
          </div>

          {/* DENOMINAZIONE */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-secondary text-sm ml-1">Denominazione sociale</label>
            <div className="flex items-center bg-gray-100 rounded-xl px-3 h-14 hover:bg-gray-200 transition-colors">
                <Icon icon="ic:baseline-people" className="text-2xl text-slate-400 mr-2 flex-shrink-0" />
                <input 
                  readOnly 
                  value={datiEnte.denominazione} 
                  className="bg-transparent w-full outline-none text-slate-700 font-medium"
                />
            </div>
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-secondary text-sm ml-1">
                E-mail <span className="font-normal text-slate-500">(facoltativo)</span>
            </label>
            <div className="flex items-center bg-gray-100 rounded-xl px-3 h-14 hover:bg-gray-200 transition-colors">
                <Icon icon="mdi:email-outline" className="text-2xl text-slate-400 mr-2 flex-shrink-0" />
                <input 
                  readOnly 
                  value={datiEnte.email} 
                  className="bg-transparent w-full outline-none text-slate-700 font-medium"
                />
            </div>
          </div>

        </div>

        {/* FOOTER AZIONI */}
        <div className="mt-10 flex gap-4">
          <Button 
            isIconOnly
            onPress={() => navigate(-1)}
            className="bg-secondary text-white min-w-[3.5rem] h-14 rounded-xl shadow-lg"
          >
            <Icon icon="mdi:arrow-left" width="24" />
          </Button>

          <Button 
            onPress={handleLogout}
            className="bg-secondary text-white w-full h-14 rounded-xl shadow-lg font-bold text-md flex items-center justify-center gap-2"
          >
            <Icon icon="mdi:logout-variant" width="20" />
            Esci
          </Button>
        </div>
        
      </main>
      
      <Navbar active="profilo" />
    </div>
  );
}