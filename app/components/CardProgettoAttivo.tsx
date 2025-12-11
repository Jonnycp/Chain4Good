import { Icon } from '@iconify/react';

interface CardProgettoAttivoProps {
  title: string;
  cover: string;
  contribution: number;
  currency: string;
  spentPercentage: number;
  badgeCount: number;
  onClick: () => void;
}

export default function CardProgettoAttivo({
  title,
  cover,
  contribution,
  currency,
  spentPercentage,
  badgeCount,
  onClick
}: CardProgettoAttivoProps) {
  return (
    <div 
        onClick={onClick}
        className="bg-white rounded-[24px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 flex gap-4 cursor-pointer active:scale-[0.98] transition-transform"
    >
        {/* Immagine Quadra con Badge */}
        <div className="relative w-24 h-24 flex-shrink-0">
            <img src={cover} alt="" className="w-full h-full object-cover rounded-xl" />
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary rounded-full text-white flex items-center justify-center text-xs font-bold shadow-md border-2 border-white">
                {badgeCount}
            </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center flex-1 pr-2">
            <h3 className="text-sm font-bold text-secondary leading-tight mb-2 line-clamp-2">
                {title}
            </h3>
            <p className="text-xs text-slate-600 mb-0.5">
                Hai contribuito con <span className="font-extrabold text-secondary">{contribution}</span> {currency}
            </p>
            <p className="text-xs text-slate-600">
                Speso il <span className="font-extrabold text-secondary">{spentPercentage}%</span> del budget
            </p>
        </div>
    </div>
  );
}