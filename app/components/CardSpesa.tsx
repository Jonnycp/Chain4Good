import React from 'react';
import { Icon } from '@iconify/react';

interface CardSpesaProps {
  id: number | string;
  titolo: string;
  importo: number;
  valuta: string;
  stato: string; // 'attesa' | 'approvata' | 'rifiutata'
  giorni?: number;
  votes?: number;
  onClick?: () => void;
}

const CardSpesa = ({
  titolo,
  importo,
  valuta,
  stato,
  giorni,
  votes,
  onClick
}: CardSpesaProps) => {

  const getStatusBadge = (stato: string) => {
    switch (stato) {
      case 'attesa':
        return { label: 'In attesa', color: 'bg-[#F4D03F] text-black border-[#F4D03F]' };
      case 'approvata':
        return { label: 'Accettata', color: 'bg-[#56A836] text-white border-[#56A836]' };
      case 'rifiutata':
        return { label: 'Rifiutata', color: 'bg-[#D32F2F] text-white border-[#D32F2F]' };
      default:
        return { label: stato, color: 'bg-gray-200 text-gray-600' };
    }
  };

  const getCardBorder = (stato: string) => {
    if (stato === 'attesa') return 'border-purple-400 ring-1 ring-purple-400';
    return 'border-gray-200';
  };

  const badge = getStatusBadge(stato);

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border ${getCardBorder(stato)} relative overflow-hidden transition-transform hover:-translate-y-1`}>
        
        {/* Badge Stato */}
        <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-[10px] font-bold ${badge.color}`}>
            {badge.label}
        </div>

        {/* Titolo */}
        <h3 className="text-secondary font-bold text-base w-3/4 mb-2 leading-tight">
            {titolo}
        </h3>

        {/* Importo */}
        <div className="text-xl font-extrabold text-secondary mb-3">
            {importo} <span className="text-sm font-normal text-gray-500">{valuta}</span>
        </div>

        {/* Footer Card */}
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                {stato === 'rifiutata' ? (
                    // Se rifiutata mostra i voti
                    <span>{votes} voti</span>
                ) : (
                    // Altrimenti mostra i giorni o l'orologio
                    <>
                        <Icon icon="mdi:clock-time-four-outline" />
                        {giorni ? `${giorni} giorni mancanti` : 'Scaduto'}
                    </>
                )}
            </div>
            
            <button 
                onClick={onClick}
                className="text-xs font-bold text-slate-500 hover:text-primary flex items-center gap-0.5"
            >
                Vedi i dettagli <Icon icon="mdi:arrow-right" />
            </button>
        </div>
    </div>
  );
};

export default CardSpesa;