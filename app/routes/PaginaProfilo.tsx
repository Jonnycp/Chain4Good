import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

import Header from '~/components/Header';
import Navbar from '~/components/Navbar';

import imgUser from '~/assets/img_user.png'; 
import avatarPlaceholder from '~/assets/libersare.png';

export default function Profilo() {
  const navigate = useNavigate();

  //  ROLE TOGGLE 
  //const isEnte = true; 
  const isEnte = false

  const profileData = {
    nome: isEnte ? "Rose" : "Rose",
    walletAddress: "0x75df0e14e...",
    saldo: "300.001",
    email: "rose_random@gmail.com",
    avatar: isEnte ? avatarPlaceholder : imgUser,
    // Specific to Ente
    denominazione: "Organizzazione di volontariato",
  };

  const handleLogout = () => {
    console.log("Logout...");
    navigate('/login');
  };

  return (
    <div className={`min-h-screen bg-white font-sans text-secondary ${isEnte ? 'pb-10' : 'pb-28'} relative`}>
      
      {/* HEADER */}
      <Header 
        type={isEnte ? 'ente' : 'utente'} 
        profileImage={profileData.avatar} 
      />

      <main className="w-full max-w-lg mx-auto px-6 mt-4">
        <h1 className="text-2xl font-extrabold text-secondary mb-8">Il tuo profilo</h1>
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            {isEnte ? (
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-green-400 to-blue-600 p-[3px]">
                    <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
                        <img 
                          src={profileData.avatar} 
                          alt="Avatar" 
                          className="w-full h-full object-cover rounded-full bg-slate-900"
                        />
                    </div>
                </div>
            ) : (
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-transparent">
                    <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
            )}
            <button className={`absolute bottom-1 right-2 text-white rounded-full p-1 border-2 border-white shadow-md flex items-center justify-center ${isEnte ? 'bg-green-600' : 'bg-primary'}`}>
              <Icon icon="mdi:plus" width="18" />
            </button>
          </div>
          
          <button className="mt-3 text-xs font-bold text-secondary hover:text-primary transition-colors">
            Modifica immagine o avatar
          </button>
        </div>

        {/* WALLET */}
        <div className="border border-slate-200 rounded-2xl py-6 px-4 text-center shadow-sm mb-10 bg-white">
          <p className="text-slate-600 font-bold text-sm mb-1">Nel wallet hai disponibili</p>
          <div className="text-4xl font-bold text-primary flex justify-center items-baseline gap-1">
            {profileData.saldo} <span className="text-lg text-primary font-semibold">ETH</span>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-1/2 space-y-2">
              <label className="text-secondary font-extrabold text-sm">
                  {isEnte ? "Nome ente" : "Nome utente"}
              </label>
              <div className="flex items-center bg-[#F3F4F6] rounded-xl px-3 h-12">
                <Icon icon={isEnte ? "lucide:user" : "mdi:user-outline"} className="text-slate-900 text-lg mr-2" />
                <span className="text-slate-600 font-medium truncate text-sm">{profileData.nome}</span>
              </div>
            </div>
            <div className="w-1/2 space-y-2">
              <label className="text-secondary font-extrabold text-sm">Wallet</label>
              <div className="flex items-center bg-[#F3F4F6] rounded-xl px-3 h-12">
                <Icon icon="mdi:link-variant" className="text-slate-900 text-lg mr-2" />
                <span className="text-slate-600 font-medium truncate text-sm">
                    {profileData.walletAddress}
                </span>
              </div>
            </div>
          </div>
          {isEnte && (
              <div className="space-y-2">
                <label className="text-secondary font-extrabold text-sm">Denominazione sociale</label>
                <div className="flex items-center bg-[#F3F4F6] rounded-xl px-3 h-12">
                  <Icon icon="ic:baseline-people" className="text-slate-900 text-xl mr-2" />
                  <span className="text-slate-600 font-medium text-sm truncate">{profileData.denominazione}</span>
                </div>
              </div>
          )}
          <div className="space-y-2">
            <label className="text-secondary font-extrabold text-sm">
                E-mail <span className="font-normal text-slate-500">(facoltativo)</span>
            </label>
            <div className="flex items-center bg-[#F3F4F6] rounded-xl px-3 h-12">
              <Icon icon="mdi:email-outline" className="text-slate-900 text-lg mr-2" />
              <input 
                type="email" 
                value={profileData.email} 
                readOnly
                className="bg-transparent text-slate-600 font-medium w-full outline-none text-sm"
              />
            </div>
          </div>

        </div>
        <div className="mt-12 flex gap-3">
          {isEnte ? (
            <>
                <button 
                    onClick={() => navigate(-1)}
                    className="bg-[#1D3D5A] text-white w-14 h-14 rounded-xl shadow-lg flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
                >
                    <Icon icon="mdi:arrow-left" width="24" />
                </button>

                <button 
                    onClick={handleLogout}
                    className="bg-[#1D3D5A] text-white h-14 rounded-xl shadow-lg flex-1 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform text-lg"
                >
                    <Icon icon="mdi:logout-variant" width="20" />
                    Esci
                </button>
            </>
          ) : (
            <button 
                onClick={handleLogout}
                className="w-full bg-secondary text-white font-bold text-lg py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform hover:bg-slate-800"
            >
                <Icon icon="mdi:logout-variant" className="text-xl rotate-180" /> 
                Esci
            </button>
          )}
        </div>
        
      </main>

      {/* NAVBAR */}
      {!isEnte && <Navbar active="profilo"/>}

    </div>
  );
}