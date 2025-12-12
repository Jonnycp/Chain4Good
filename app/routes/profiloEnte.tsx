// app/routes/profiloEnte.tsx
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '~/components/Header';

import logoChain4Good from '~/assets/logo.png'; 
import avatarPlaceholder from '~/assets/libersare.png';

export default function ProfiloEnte() {
  const navigate = useNavigate();

  // Dati simulati
  const [datiEnte] = useState({
    nome: "Rose",
    walletAddress: "0x75df0e14e...", 
    saldo: "300.001",
    denominazione: "Organizzazione di volontariato",
    email: "rose_random@gmail.com",
    avatar: avatarPlaceholder
  });

  const handleLogout = () => {
    console.log("Logout...");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-secondary pb-10">
      <Header type="ente" profileImage={datiEnte.avatar} />

      {/* CONTENUTO PRINCIPALE */}
      <main className="w-full max-w-lg mx-auto px-6">
        
        {/* TITOLO */}
        <h1 className="text-2xl font-bold text-secondary mb-8">Il tuo profilo</h1>

        {/* SEZIONE AVATAR */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            {/* Cerchio con gradiente */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-green-400 to-blue-600 p-[3px]">
                <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
                    <img 
                      src={datiEnte.avatar} 
                      alt="Avatar" 
                      className="w-full h-full object-cover rounded-full bg-slate-900"
                    />
                </div>
            </div>
            
            {/* Pulsante (+) verde */}
            <button className="absolute bottom-1 right-2 bg-green-600 text-white rounded-full p-1 border-2 border-white shadow-md flex items-center justify-center">
              <Icon icon="mdi:plus" width="18" />
            </button>
          </div>
          
          <button className="mt-3 text-xs font-bold text-secondary hover:text-primary transition-colors">
            Modifica immagine o avatar
          </button>
        </div>

        {/* CARD WALLET */}
        <div className="border border-slate-200 rounded-2xl py-6 px-4 text-center shadow-sm mb-10 bg-white">
          <p className="text-slate-600 font-medium text-sm mb-1">Nel wallet hai disponibili</p>
          <div className="text-4xl font-bold text-primary flex justify-center items-baseline gap-1">
            {datiEnte.saldo} <span className="text-lg text-primary font-semibold">ETH</span>
          </div>
        </div>

        {/* CAMPI INFORMAZIONI */}
        <div className="space-y-6">
          
          {/* RIGA 1: Nome e Wallet affiancati */}
          <div className="flex gap-4">
            {/* Nome Ente */}
            <div className="w-1/2 space-y-2">
              <label className="text-[#0F172A] font-bold text-sm">Nome ente</label>
              <div className="flex items-center bg-[#F3F4F6] rounded-lg px-3 h-12">
                <Icon icon="lucide:user" className="text-slate-900 text-lg mr-2" />
                <span className="text-slate-600 font-medium truncate text-sm">{datiEnte.nome}</span>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="w-1/2 space-y-2">
              <label className="text-secondary font-bold text-sm">Wallet</label>
              <div className="flex items-center bg-[#F3F4F6] rounded-lg px-3 h-12">
                <Icon icon="mdi:link-variant" className="text-slate-900 text-lg mr-2" />
                <span className="text-slate-600 font-medium truncate text-sm">
                    {datiEnte.walletAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Denominazione Sociale */}
          <div className="space-y-2">
            <label className="text-secondary font-bold text-sm">Denominazione sociale</label>
            <div className="flex items-center bg-[#F3F4F6] rounded-lg px-3 h-12">
              <Icon icon="ic:baseline-people" className="text-slate-900 text-xl mr-2" />
              <span className="text-slate-600 font-medium text-sm truncate">{datiEnte.denominazione}</span>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-secondary font-bold text-sm">
                E-mail <span className="font-normal text-slate-500">(facoltativo)</span>
            </label>
            <div className="flex items-center bg-[#F3F4F6] rounded-lg px-3 h-12">
              <Icon icon="mdi:email-outline" className="text-slate-900 text-lg mr-2" />
              <input 
                type="email" 
                value={datiEnte.email} 
                readOnly
                className="bg-transparent text-slate-600 font-medium w-full outline-none text-sm"
              />
            </div>
          </div>

        </div>

        {/* FOOTER AZIONI */}
        <div className="mt-12 flex gap-3">
          {/* Tasto Indietro */}
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#1D3D5A] text-white w-14 h-14 rounded-xl shadow-lg flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
          >
            <Icon icon="mdi:arrow-left" width="24" />
          </button>

          {/* Tasto Esci */}
          <button 
            onClick={handleLogout}
            className="bg-[#1D3D5A] text-white h-14 rounded-xl shadow-lg flex-1 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform text-lg"
          >
            <Icon icon="mdi:logout-variant" width="20" />
            Esci
          </button>
        </div>
        
      </main>
    </div>
  );
}