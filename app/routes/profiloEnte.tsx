import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

import logoChain4Good from '~/assets/logo.png'; 
import avatarPlaceholder from '~/assets/libersare.png';

export default function ProfiloEnte() {
  const navigate = useNavigate();

  // Simulazione MetaMask
  const [datiEnte, setDatiEnte] = useState({
    nome: "Rose",
    walletAddress: "0x75df0e14e...", 
    saldo: "300.001",
    denominazione: "Organizzazione di volontariato",
    email: "rose_random@gmail.com",
    avatar: avatarPlaceholder
  });

  // Funzione per accorciare l'indirizzo wallet se necessario
  const formatAddress = (addr: string) => {
    return addr.length > 10 ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : addr;
  };

  const handleLogout = () => {
    //  aggiugnere logica per disconnettere il wallet o cancellare il token di sessione
    console.log("Disconnessione in corso...");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-secondary font-sans pb-10">
      
      {/* HEADER */}
      <header className="p-4 flex justify-between items-center max-w-md mx-auto">
        <div className="flex items-center gap-2">
            <img src={logoChain4Good} alt="Chain4Good Logo" className="h-8" />
            <div className="flex items-center font-bold text-xl text-secondary">
                Chain<span className="text-primary">4</span>Good
            </div>
        </div>
        <button className="text-secondary hover:text-primary transition">
          <Icon icon="mdi:cog" width="28" />
        </button>
      </header>

      {/* CONTENUTO PRINCIPALE */}
      <main className="max-w-md mx-auto px-6 mt-2">
        
        <h1 className="text-2xl font-bold text-secondary mb-6">Il tuo profilo</h1>

        {/* SEZIONE AVATAR */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-green-500/30 p-1">
                <img 
                  src={datiEnte.avatar} 
                  alt="Avatar Ente" 
                  className="w-full h-full object-cover rounded-full bg-slate-900"
                  // Fallback se l'immagine non esiste
                  onError={(e) => {e.currentTarget.src = "https://placehold.co/150x150/0f172a/FFF?text=Logo"}}
                />
            </div>
            {/* Pulsante Modifica (+) */}
            <button className="absolute bottom-1 right-1 bg-green-500 text-white rounded-full p-1 border-2 border-white shadow-md hover:bg-primary transition">
              <Icon icon="mdi:plus" width="20" />
            </button>
          </div>
          <button className="mt-3 text-sm text-slate-600 hover:text-primary font-medium">
            Modifica immagine o avatar
          </button>
        </div>

        {/* CARD WALLET */}
        <div className="border border-slate-200 rounded-xl p-6 text-center shadow-sm mb-8 bg-white">
          <p className="text-slate-600 font-medium mb-1">Nel wallet hai disponibili</p>
          <div className="text-4xl font-bold text-primary flex justify-center items-baseline gap-1">
            {datiEnte.saldo} <span className="text-lg text-green-700 font-semibold">ETH</span>
          </div>
        </div>

        {/* CAMPI INFORMAZIONI */}
        <div className="space-y-5">
          
          {/* Riga 1: Nome e Wallet */}
          <div className="grid grid-cols-2 gap-4">
            {/* Nome Ente */}
            <div className="space-y-2">
              <label className="text-secondary font-bold text-sm">Nome ente</label>
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-3">
                <Icon icon="lucide:user-round" className="text-slate-900 text-xl mr-2" />
                <span className="text-slate-700 font-medium truncate">{datiEnte.nome}</span>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="space-y-2">
              <label className="text-secondary font-bold text-sm">Wallet</label>
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-3">
                <Icon icon="mdi:link-variant" className="text-slate-900 text-xl mr-2" />
                <span className="text-slate-700 font-medium truncate text-sm">
                    {datiEnte.walletAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Denominazione Sociale */}
          <div className="space-y-2">
            <label className="text-secondary font-bold text-sm">Denominazione sociale</label>
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-3">
              <Icon icon="ic:baseline-people" className="text-slate-900 text-xl mr-2" />
              <span className="text-slate-700 font-medium">{datiEnte.denominazione}</span>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-secondary font-bold text-sm">E-mail <span className="font-normal text-slate-900">(facoltativo)</span></label>
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-3">
              <Icon icon="mdi:email-outline" className="text-slate-900 text-xl mr-2" />
              <input 
                type="email" 
                value={datiEnte.email} 
                readOnly
                className="bg-transparent text-slate-700 font-medium w-full outline-none"
              />
            </div>
          </div>

        </div>

        {/* FOOTER  */}
        <div className="mt-10 flex gap-4">
          {/* Tasto Indietro */}
          <button 
            onClick={() => navigate(-1)}
            className="bg-secondary hover:bg-slate-700 text-white p-3 rounded-xl shadow-lg transition flex items-center justify-center min-w-[3.5rem]"
          >
            <Icon icon="mdi:arrow-left" width="24" />
          </button>

          {/* Tasto Esci */}
          <button 
            onClick={handleLogout}
            className="bg-secondary hover:bg-slate-700 text-white py-3 px-6 rounded-xl shadow-lg w-full font-bold flex items-center justify-center gap-2 transition"
          >
            <Icon icon="mdi:logout-variant" width="20" />
            Esci
          </button>
        </div>

      </main>
    </div>
  );
}