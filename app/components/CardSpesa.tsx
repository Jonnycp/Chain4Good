import { Icon } from '@iconify/react';
import type { Spesa } from '~/context/AppProvider';

const CardSpesa = ({
  title,
  amount,
  status,
  votes,
  currency,
  createdAt,
  myVote,
  isMy,
  executed,
  onClick
}: Spesa & {
  onClick?: () => void;
  currency: string;
  isMy: boolean;
}) => {

  const scadenza = new Date(createdAt);
  scadenza.setDate(scadenza.getDate() + 3); // Scade dopo 3 giorni
  const oggi = new Date();
  const diffTime = scadenza.getTime() - oggi.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const giorni = diffDays > 0 ? diffDays : 0;

  const showPing = (status === 'votazione' && !isMy && !myVote) || (status === 'approvata' && isMy && !executed)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'votazione':
        if (!isMy) {
          if (myVote) {
            return { label: 'Hai già votato', color: 'bg-blue-500 text-white border-blue-500' };
          } else {
            return { label: 'Da votare', color: 'bg-purple-400 text-white border-purple-400' };
          }
        } else {
          return { label: 'In votazione', color: 'bg-[#F4D03F] text-black border-[#F4D03F]' };
        }
      case 'approvata':
        if(isMy && !executed) {
          return { label: 'Accettata, da eseguire', color: 'animate-pulse bg-[#56A836] text-white border-[#56A836]' };
        }
        return { label: 'Accettata', color: 'bg-[#56A836] text-white border-[#56A836]' };
      case 'rifiutata':
        return { label: 'Rifiutata', color: 'bg-[#D32F2F] text-white border-[#D32F2F]' };
      default:
        return { label: status, color: 'bg-gray-200 text-gray-600' };
    }
  };

  const getCardBorder = (status: string) => {
    if (status === 'votazione') return 'border-purple-400 ring-1 ring-purple-400';
    if (status === 'approvata' && isMy && !executed) return 'ring-1 border-[#56A836]';
    return 'border-gray-200';
  };

  const badge = getStatusBadge(status);

  return (
    <div onClick={onClick} className={`cursor-pointer bg-white rounded-2xl p-4 shadow-sm border ${getCardBorder(status)} relative overflow-hidden transition-transform hover:-translate-y-1`}>
        {/* Ping Notifica */}
        {showPing && (
          <span className="absolute -top-0 left-0 flex h-3 w-3 z-100">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        )}

        {/* Badge Stato */}
        <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-[10px] font-bold ${badge.color}`}>
            {badge.label}
        </div>

        {/* Titolo */}
        <h3 className="text-secondary font-bold text-base w-3/4 mb-2 leading-tight">
            {title}
        </h3>

        {/* Importo */}
        <div className="text-xl font-extrabold text-secondary mb-3">
            {amount} <span className="text-sm font-normal text-gray-500">{currency}</span>
        </div>

        {/* Footer Card */}
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                {status != 'votazione' ? (
                    <span>{votes.votesAgainst + votes.votesFor} vot{votes.votesAgainst + votes.votesFor == 0 ? 'i' : votes.votesAgainst + votes.votesFor == 1 ? 'o' : 'i'} dal {new Date(createdAt).toLocaleDateString()}</span>
                ) : (
                    <>
                        <Icon icon="mdi:clock-time-four-outline" />
                        {giorni ? `${giorni} giorni mancanti` : 'Scaduto'}
                    </>
                )}
            </div>
            
            <button 
                onClick={onClick}
                className="text-xs cursor-pointer font-bold text-slate-500 hover:text-primary flex items-center gap-0.5"
            >
                Vedi i dettagli <Icon icon="mdi:arrow-right" />
            </button>
        </div>
    </div>
  );
};

export default CardSpesa;