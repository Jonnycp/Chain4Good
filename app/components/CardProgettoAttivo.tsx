import { useNavigate } from 'react-router';
import type { AppContextType } from '~/context/AppProvider';

export function CardProgettoAttivoSkeleton() {
  return (
    <div className="bg-white rounded-[24px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 flex gap-4 animate-pulse">
      {/* Immagine Quadra con Badge */}
      <div className="relative w-24 h-24 flex-shrink-0">
        <div className="w-full h-full bg-gray-200 rounded-xl" />
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold shadow-md border-2 border-white" />
      </div>
      {/* Info */}
      <div className="flex flex-col justify-center flex-1 pr-2">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function CardProgettoAttivo({
  _id,
  titolo,
  cover,
  currentAmount,
  currency,
  contribution,
  speseInVoto,
  totaleSpeso,
}: AppContextType["statsDonations"]["progettiAttivi"][0]) {
  const navigate = useNavigate();
  return (
    <div 
        onClick={() => navigate("/progetto/" + _id)}
        className="bg-white rounded-[24px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 flex gap-4 cursor-pointer active:scale-[0.98] transition-transform"
    >
        {/* Immagine Quadra con Badge */}
        <div className="relative w-24 h-24 flex-shrink-0">
            <img src={
              cover.startsWith("https://")
                ? cover
                : `${import.meta.env.VITE_BACKEND_URL}/${cover}`
            } alt="" className="w-full h-full object-cover rounded-xl" />
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary rounded-full text-white flex items-center justify-center text-xs font-bold shadow-md border-2 border-white">
                {speseInVoto}
            </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center flex-1 pr-2">
            <h3 className="text-sm font-bold text-secondary leading-tight mb-2 line-clamp-2">
                {titolo}
            </h3>
            <p className="text-xs text-slate-600 mb-0.5">
                Hai contribuito con <span className="font-extrabold text-secondary">{contribution}</span> {currency}
            </p>
            <p className="text-xs text-slate-600">
                Speso il <span className="font-extrabold text-secondary">{Math.round((totaleSpeso / currentAmount) * 100)}%</span> del budget
            </p>
        </div>
    </div>
  );
}