import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import Navbar from '~/components/Navbar'; 

import logo from '~/assets/logo.png';
import imgUser from '~/assets/img_user.png'; 

export default function UserProfile() {
  const navigate = useNavigate();

  // DATI UTENTE SIMULATI
  const userData = {
    username: "Rose",
    walletAddress: "0x75df0e14e...",
    email: "rose_random@gmail.com",
    walletBalance: "300.001"
  };

  // Funzione di Logout
  const handleLogout = () => {
    console.log("Eseguo il logout...");
    // Qui andrebbe la logica per pulire il token/sessione
    navigate('/login'); 
  };

  return (
    <div className="min-h-screen bg-white font-sans pb-28 relative">
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 pt-8 pb-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo Chain4Good" className="h-7 w-auto object-contain" />
           <span className="text-xl font-extrabold text-secondary tracking-tight">
             Chain<span className="text-primary">4</span>Good
           </span>
        </div>
          <button className="text-black text-2xl p-1">
             <Icon icon="mdi:cog" />
          </button>
      </div>

    {/* CONTENUTO PRINCIPALE */}
      <main className="px-6 mt-4">
        
        {/* Titolo */}
        <h1 className="text-2xl font-extrabold text-secondary mb-8">Il tuo profilo</h1>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {/* Immagine Profilo */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-transparent">
                <img src={imgUser} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            {/* Tasto Modifica (+) */}
            <button className="absolute bottom-1 right-2 bg-primary text-white rounded-full p-1 border-[3px] border-white shadow-sm flex items-center justify-center">
              <Icon icon="mdi:plus" width="20" height="20" />
            </button>
          </div>
          <button className="text-xs font-bold text-secondary mt-3 hover:text-primary transition-colors">
            Modifica immagine o avatar
          </button>
        </div>

        {/* Card Wallet */}
        <div className="border border-slate-300 rounded-2xl p-6 text-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] mb-8">
          <p className="text-secondary font-bold text-sm mb-1">Nel wallet hai disponibili</p>
          <div className="text-4xl font-bold text-primary flex items-center justify-center gap-1">
            {userData.walletBalance}<span className="text-lg font-semibold text-primary">ETH</span>
          </div>
        </div>

        {/* Form Dati Utente */}
        <div className="space-y-5 mb-10">
          
          {/* Riga: Nome Utente e Wallet affiancati */}
          <div className="flex gap-4">
             {/* Nome Utente */}
             <div className="w-1/2">
                <label className="block text-sm font-extrabold text-secondary mb-2">Nome utente</label>
                <div className="flex items-center bg-[#F5F5F5] rounded-xl px-3 py-3.5">
                  <Icon icon="mdi:user-outline" className="text-black text-xl mr-2" />
                  <span className="text-gray-600 font-medium text-sm truncate">{userData.username}</span>
                </div>
             </div>

             {/* Wallet */}
             <div className="w-1/2">
                <label className="block text-sm font-extrabold text-secondary mb-2">Wallet</label>
                <div className="flex items-center bg-[#F5F5F5] rounded-xl px-3 py-3.5">
                  <Icon icon="mdi:link-variant" className="text-black text-xl mr-2" />
                  <span className="text-gray-600 font-medium text-sm truncate">{userData.walletAddress}</span>
                </div>
             </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-extrabold text-secondary mb-2">
                E-mail <span className="font-normal text-gray-500">(facoltativo)</span>
            </label>
            <div className="flex items-center bg-[#F5F5F5] rounded-xl px-4 py-3.5">
              <Icon icon="mdi:email-outline" className="text-black text-xl mr-3" />
              <span className="text-gray-600 font-medium text-sm truncate">{userData.email}</span>
            </div>
          </div>

        </div>

        {/* Tasto Esci */}
        <button 
            onClick={handleLogout}
            className="w-full bg-secondary text-white font-bold text-lg py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform hover:bg-slate-800"
        >
            <Icon icon="mdi:logout-variant" className="text-xl rotate-180" /> 
            Esci
        </button>

      </main>

      {/* NAVBAR (Tipo User) */}
      <Navbar active="profilo"/>
    </div>
  );
}