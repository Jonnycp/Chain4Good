import React from 'react';
import { Icon } from '@iconify/react';

interface Donation {
  id: string;
  amount: number;
  currency: string;
  date: string;
  hash: string;
}

interface CardProgettoSupportatoProps {
  title: string;
  location: string;
  cover: string;
  logoEnte: string;
  percent: number;
  daysLeft: number;
  supporters: number;
  donations: Donation[];
  userAvatar: string;
  onProjectClick: () => void;
  onEnteClick: (e: React.MouseEvent) => void;
  onMapClick: (e: React.MouseEvent) => void;
  onCopyHash: (e: React.MouseEvent, hash: string) => void;
}

export default function CardProgettoSupportato({
  title,
  location,
  cover,
  logoEnte,
  percent,
  daysLeft,
  supporters,
  donations,
  userAvatar,
  onProjectClick,
  onEnteClick,
  onMapClick,
  onCopyHash
}: CardProgettoSupportatoProps) {
  return (
    <div 
        onClick={onProjectClick}
        className="bg-white rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
    >
        {/* Header Card */}
        <div className="relative h-40 w-full">
            <img src={cover} alt={title} className="w-full h-full object-cover" />
            
            {/* Badge Location */}
            <button 
                onClick={onMapClick}
                className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md hover:bg-gray-50 transition"
            >
                <Icon icon="solar:map-point-bold" className="text-secondary w-3.5 h-3.5" />
                <span className="text-xs font-bold text-secondary">{location}</span>
            </button>

            {/* Logo Ente */}
            <div 
                onClick={onEnteClick}
                className="absolute -bottom-6 left-6 z-10 hover:scale-105 transition-transform"
            >
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-blue-900 p-[3px]">
                    <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
                        <img src={logoEnte} alt="Logo" className="w-full h-full object-cover rounded-full" />
                    </div>
                </div>
            </div>
        </div>

        {/* Body Card */}
        <div className="pt-10 px-6 pb-6">
            <h3 className="text-lg font-extrabold text-secondary leading-tight mb-4">
                {title}
            </h3>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${percent}%` }}></div>
                </div>
                <span className="text-xs font-medium text-slate-500">{percent}%</span>
            </div>

            {/* LISTA TRANSAZIONI */}
            <div className="space-y-5 mb-6">
                {donations.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-start border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                        <div>
                            <p className="text-sm text-secondary">
                                Hai donato <span className="font-extrabold">{tx.amount}</span> <span className="font-bold text-xs">{tx.currency}</span>
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">Il {tx.date}</p>
                        </div>
                        {/* Pulsante Copia Hash */}
                        <button 
                            onClick={(e) => onCopyHash(e, tx.hash)}
                            className="text-secondary hover:text-primary p-1 rounded-full hover:bg-slate-50 transition active:scale-90"
                            title="Copia Hash Transazione"
                        >
                            <Icon icon="mdi:link-variant" className="text-xl rotate-[-45deg]" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Footer Card */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-500">
                    <Icon icon="solar:clock-circle-bold" className="w-5 h-5 opacity-80" />
                    <span className="text-xs font-medium">{daysLeft} giorni mancanti</span>
                </div>
                
                {/* Avatar Mock */}
                <div className="flex items-center gap-1">
                    <div className="flex -space-x-2">
                        <img className="w-6 h-6 rounded-full border border-white" src={userAvatar} alt="" />
                        <img className="w-6 h-6 rounded-full border border-white opacity-60" src={userAvatar} alt="" />
                        <img className="w-6 h-6 rounded-full border border-white opacity-40" src={userAvatar} alt="" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 pl-1">+{supporters}</span>
                </div>
            </div>

        </div>
    </div>
  );
}