import React from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom'; 

export type ProjectStatus = 'raccolta' | 'attivo' | 'terminato';

interface CardHomeProps {
  id: string | number;        
  authorId: string | number;
  coverImage: string;
  authorLogo: string;
  title: string;
  authorName: string;
  location?: string;
  
  currentAmount: number;    //Obbligatorio
  currency?: string;        //Obbligatorio
  
  status?: ProjectStatus;    
  
  targetAmount?: number;     // Opzionale (serve solo se 'raccolta')
  daysLeft?: number;         // Opzionale (serve solo se 'raccolta')

  spentPercentage?: number;  // Opzionale (serve solo se 'attivo')
  expensesCount?: number;    // Opzionale (serve solo se 'attivo')
  donorsCount?: number;      // Opzionale (serve solo se 'attivo')
}

const CardHome = ({
  id,
  authorId,
  coverImage,
  authorLogo,
  title,
  authorName,
  location = "Bari",
  currentAmount,
  currency = "ETH",
  status = 'raccolta',
  targetAmount = 0,
  daysLeft = 0,
  spentPercentage = 0,
  expensesCount = 0,
  donorsCount = 0
}: CardHomeProps) => {

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/progetto/${id}`);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    navigate(`/ente/${authorId}`); 
  };

  const handleLocationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    //da completare con funzionalità mappa
  };

  // LOGICA BADGE STATO
  const getBadgeConfig = () => {
    switch (status) {
      case 'attivo':
        return {
          label: 'Attivo',
          className: 'bg-[#67AA28] text-white', 
        };
      case 'terminato':
        return {
          label: 'Terminato',
          className: 'bg-slate-400 text-white',
        };
      case 'raccolta':
      default:
        return {
          label: 'Raccolta fondi',
          className: 'bg-[#EBD44F] text-[#1E293B]', 
        };
    }
  };

  const badgeConfig = getBadgeConfig();
  const formattedAmount = new Intl.NumberFormat('it-IT').format(currentAmount);
  
  // Calcolo percentuale solo per raccolta fondi
  const progressPercentage = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;

  return (
    <div 
      onClick={handleCardClick}
      className="relative w-full max-w-sm bg-white rounded-[32px] shadow-lg border border-gray-100 transition-transform hover:-translate-y-1 duration-300 cursor-pointer group overflow-hidden"
    >
      {/* HEADER IMMAGINE */}
      <div className="relative h-48 w-full">
        <img 
          src={coverImage} 
          alt={title} 
          className="w-full h-full object-cover"
        />

        {/* BADGE STATO DINAMICO */}
        <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-[24px] font-bold text-sm shadow-sm z-10 ${badgeConfig.className}`}>
          {badgeConfig.label}
        </div>

        {/* BADGE LUOGO */}
        <button 
          onClick={handleLocationClick}
          className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 shadow-sm z-10 hover:bg-blue-50"
        >
          <Icon icon="solar:map-point-bold" className="text-gray-800 w-3.5 h-3.5" />
          <span className="text-xs font-bold text-gray-800">{location}</span>
        </button>

        {/* LOGO AUTORE */}
        {/*
        <div 
          onClick={handleAuthorClick}
          className="absolute -bottom-8 left-6 z-20 cursor-pointer transition-transform hover:scale-105 active:scale-95"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-400 to-blue-600 p-[2px]">
             <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
                <img src={authorLogo} alt={authorName} className="w-full h-full object-cover rounded-full"/>
             </div>
          </div>
        </div>
        */}
{/* test per portare il clock su ente visibile */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            console.log("Click sul logo rilevato!"); 
            navigate('/ente-visibile'); 
          }}
          className="absolute -bottom-8 left-6 z-20 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          title={`Vai al profilo di ${authorName}`}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-green-400 to-blue-600 p-[3px]">
             <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
                <img 
                  src={authorLogo} 
                  alt={authorName} 
                  className="w-full h-full object-cover rounded-full"
                />
             </div>
          </div>
        </div>
        {/* Fine test */}
        
      </div>

      {/* BODY */}
      <div className="px-6 pt-10 pb-6">
        
        {/* Titolo */}
        <h3 className="text-lg font-extrabold text-[#1E293B] leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h3>

        {/* CONTENUTO CONDIZIONALE */}
        {status === 'raccolta' ? (
          /* VISTA RACCOLTA FONDI */
          <>
            {/* Barra di Progresso */}
            <div className="flex items-center gap-3 mb-1">
              <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                <div 
                  className="bg-[#56A836] h-full rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-gray-500">{Math.round(progressPercentage)}%</span>
            </div>

            {/* Cifra */}
            <div className="text-xl font-bold text-gray-800 mb-4">
              {formattedAmount} <span className="text-sm text-gray-500 font-normal">{currency}</span>
            </div>

            {/* Footer Raccolta */}
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Icon icon="solar:clock-circle-bold" className="w-5 h-5 opacity-80" />
                <span className="text-xs font-medium">{daysLeft} giorni mancanti</span>
              </div>
              
              {/* Avatar sostenitori mock */}
              <div className="flex -space-x-2">
                 <img className="w-6 h-6 rounded-full border border-white" src={authorLogo} alt="" />
                 <img className="w-6 h-6 rounded-full border border-white opacity-80" src={authorLogo} alt="" />
                 <span className="text-[10px] text-gray-500 pl-3 self-center font-bold">+10</span>
              </div>
            </div>
          </>
        ) : (
          /* VISTA PROGETTO ATTIVO / TERMINATO */
          <>
            {/* Statistiche Spesa */}
            <div className="space-y-1 mb-4">
                <p className="text-[#1E293B] font-medium text-sm">
                    Raccolto <span className="font-bold text-lg">{formattedAmount}</span> <span className="text-xs text-gray-500">{currency}</span>
                </p>
                <p className="text-[#1E293B] font-medium text-sm">
                    Speso il <span className="font-bold">{spentPercentage}%</span> del budget
                </p>
            </div>

            {/* Footer Attivo */}
            <div className="flex justify-between items-center mt-6">
                {/* Spese effettuate */}
                <div className="flex items-center gap-2 text-gray-500">
                    <Icon icon="mdi:cart-outline" className="w-5 h-5 text-[#1E293B]" />
                    <span className="text-xs font-medium">{expensesCount} spese effettuate</span>
                </div>

                {/* Donatori */}
                <div className="flex items-center gap-1">
                    <div className="flex -space-x-2">
                        <img className="w-6 h-6 rounded-full border border-white" src={authorLogo} alt="" />
                        <img className="w-6 h-6 rounded-full border border-white opacity-80" src={authorLogo} alt="" />
                        <img className="w-6 h-6 rounded-full border border-white opacity-60" src={authorLogo} alt="" />
                    </div>
                    <span className="text-[10px] text-gray-400 ml-1">{donorsCount} donatori</span>
                </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default CardHome;