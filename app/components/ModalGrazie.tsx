import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import treeLogo from '~/assets/logo.png'; 

interface ModalGrazieProps {
  amount: number;
  projectName: string; 
  enteName: string;
  currency: string;
  onClose: () => void;
  onHistory: () => void;
}

export default function ModalGrazie({ amount, projectName, enteName, currency, onClose, onHistory }: ModalGrazieProps) {

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-appearance-in">
      <div className="absolute inset-0" onClick={() => onClose()}></div>
      <div className="bg-white rounded-[32px] w-full max-w-sm p-8 text-center shadow-2xl flex flex-col items-center relative">
        
        <div className="mb-6">
            <img src={treeLogo} alt="Grazie" className="w-24 h-24 object-contain mx-auto" />
        </div>

        <h2 className="text-3xl font-extrabold text-secondary mb-4 tracking-wide uppercase">
          GRAZIE
        </h2>
        
        <p className="text-md text-slate-600 font-medium leading-relaxed mb-6">
          Hai donato <span className="font-bold text-secondary">{amount} {currency}</span> al progetto<br/>
          <span className="font-bold text-secondary">{projectName}</span>
        </p>

        <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Al termine della raccolta fondi, potrai partecipare alla <strong>revisione</strong> delle spese del progetto.
        </p>
        
        <p className="text-xs text-slate-500 leading-relaxed mb-8">
            È anche grazie a te che <strong>{enteName}</strong> riuscirà a completare il progetto.
        </p>

        <div className="flex gap-3 w-full">
            <button 
                onClick={onHistory}
                className="flex-1 h-12 bg-secondary hover:bg-blue-900 text-white font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-[0.98]"
            >
                Vai allo storico donazioni
            </button>
            <button onClick={() => {
              navigator.share({title: `Chain4Good - Progetto ${projectName}`,
              text: `Dai un'occhiata al progetto "${projectName}" che ho supportato su Chain4Good!`,
              url: window.location.href,
              })
            }} className="w-12 h-12 flex items-center justify-center bg-secondary hover:bg-blue-900 text-white rounded-xl shadow-lg">
                <Icon icon="mdi:share-variant-outline" className="text-xl" />
            </button>
        </div>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500">
            <Icon icon="mdi:close" className="text-2xl" />
        </button>

      </div>
    </div>
  );
}