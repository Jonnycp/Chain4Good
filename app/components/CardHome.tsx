import React from 'react';
// 1. Importiamo il componente Iconify
import { Icon } from '@iconify/react';

interface CardHomeProps {
  coverImage: string;
  authorLogo: string;
  title: string;
  authorName: string;
  daysLeft: number;
  currentAmount: number;
  targetAmount: number;
  location?: string; // Ho reso il luogo opzionale, default "Bari" se manca
}

const CardHome = ({
  coverImage,
  authorLogo,
  title,
  authorName,
  daysLeft,
  currentAmount,
  targetAmount,
  location = "Bari" // Valore di default
}: CardHomeProps) => {

  const progressPercentage = Math.min((currentAmount / targetAmount) * 100, 100);
  const percentageDisplay = Math.round(progressPercentage);
  const formattedAmount = new Intl.NumberFormat('it-IT').format(currentAmount);

  return (
    <div className="relative w-full max-w-sm bg-white rounded-[32px] shadow-lg border border-gray-100 transition-transform hover:-translate-y-1 duration-300 cursor-pointer group">
      
      {/* --- HEADER --- */}
      <div className="relative h-48 w-full">
        <img 
          src={coverImage} 
          alt={title} 
          className="w-full h-full object-cover rounded-t-[32px]"
        />

        {/* BADGE LUOGO (Con Iconify) */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 shadow-sm z-10">
          {/* Icona Pin Mappa */}
          <Icon icon="solar:map-point-bold" className="text-gray-800 w-4 h-4" />
          <span className="text-sm font-bold text-gray-800">{location}</span>
        </div>

        {/* LOGO AUTORE SOVRAPPOSTO */}
        <div className="absolute -bottom-8 left-6">
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
      </div>

      {/* --- BODY --- */}
      <div className="px-6 pt-12 pb-6">
        
        {/* Titolo */}
        <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Barra di Progresso */}
        <div className="flex items-center gap-3 mb-1">
          <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
            <div 
              className="bg-green-600 h-full rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-bold text-gray-500">{percentageDisplay}%</span>
        </div>

        {/* Cifra */}
        <div className="text-2xl font-bold text-gray-800 mb-6">
          {formattedAmount} <span className="text-lg text-gray-500 font-normal">ETH</span>
        </div>

        {/* --- FOOTER --- */}
        <div className="flex justify-between items-center mt-4">
          
          {/* Giorni mancanti (Con Iconify) */}
          <div className="flex items-center gap-2 text-gray-600">
            {/* Icona Orologio */}
            <Icon icon="solar:clock-circle-bold" className="w-5 h-5 opacity-80" />
            <span className="text-sm font-medium">{daysLeft} giorni mancanti</span>
          </div>

          {/* Avatar Supporter (Mock) */}
          <div className="flex -space-x-3">
             <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src={authorLogo} alt="" />
             <img className="w-8 h-8 rounded-full border-2 border-white object-cover opacity-80" src={authorLogo} alt="" />
             <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
               +10
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CardHome;