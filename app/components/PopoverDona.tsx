import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import userAvatar from '~/assets/libersare.png'; 

interface PopoverDonaProps {
  onClose: () => void;
  onConfirm: (amount: number, message: string) => void;
}

export default function PopoverDona({ onClose, onConfirm }: PopoverDonaProps) {
  const [amountStr, setAmountStr] = useState<string>('');
  const [message, setMessage] = useState('');
  
  const presets = [20, 50, 100, 150, 200, 500];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Gestione input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || parseFloat(val) >= 0) {
        setAmountStr(val);
    }else{
        return;
    }
  };

  // Calcolo valore numerico per controlli
  const currentAmount = parseFloat(amountStr || '0');
  const showSuccessBox = currentAmount > 0;

  const handleConfirm = () => {
    if (currentAmount > 0) {
        onConfirm(currentAmount, message);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-appearance-in">
      {/* Overlay click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white rounded-[32px] w-full max-w-sm p-6 relative shadow-2xl flex flex-col animate-slide-up sm:animate-none z-10">
        <h2 className="text-lg font-extrabold text-secondary text-center mb-6 mt-2">
          Quanto vuoi donare al progetto?
        </h2>
        {/* Presets */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
            {presets.map((val) => (
                <button
                    key={val}
                    onClick={() => setAmountStr(val.toString())}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                        currentAmount === val 
                        ? 'bg-primary text-white border-primary shadow-md' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-primary'
                    }`}
                >
                    {val}€
                </button>
            ))}
        </div>

        {/* Input Personalizzabile - ALLINEATO A DESTRA */}
        <div className="relative mb-6 border-b-2 border-slate-100 pb-2 flex items-center justify-between group focus-within:border-primary transition-colors">
            
            {/* Icona Euro a sinistra */}
            <Icon icon="mdi:currency-eur" className="text-4xl text-secondary opacity-20 pointer-events-none mr-2" />
            
            <div className="flex items-center justify-end w-full">
                {/* Input: text-right per allineare i numeri a destra */}
                <input 
                    type="number"
                    value={amountStr}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full text-4xl font-extrabold text-secondary bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-slate-200 text-right pr-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                
                {/* Suffisso fisso estetico */}
                <span className="text-xl font-bold text-secondary opacity-40 mb-1 mr-2">,00</span>
                
                <span className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap mb-1">EUR</span>
            </div>
        </div>

        {/* Box Congratulazioni (Condizionale) */}
        {showSuccessBox ? (
            <div className="bg-[#E7F6E9] rounded-xl p-4 mb-6 flex items-center justify-between relative overflow-hidden animate-appearance-in">
                <div className="relative z-10 max-w-[80%]">
                    <p className="text-xs font-bold text-secondary mb-0.5">Congratulazioni!</p>
                    <p className="text-[10px] text-slate-600 leading-tight">Contribuirai attivamente a tutte le spese del progetto</p>
                </div>
                <Icon icon="mdi:medal" className="text-secondary text-3xl opacity-80" />
                <div className="absolute -top-2 right-10 w-4 h-4 bg-[#E7F6E9] rotate-45 transform"></div>
            </div>
        ) : (
            <div className="mb-6 h-4"></div> 
        )}

        <div className="mb-6">
            <label className="flex items-center gap-2 text-sm text-secondary font-bold mb-2">
                <Icon icon="mdi:message-outline" /> Aggiungi messaggio
            </label>
            <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-primary resize-none h-24"
            />
        </div>

        <button 
            onClick={handleConfirm}
            disabled={!showSuccessBox}
            className={`w-full font-bold text-lg py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                showSuccessBox 
                ? 'bg-primary hover:bg-green-700 text-white cursor-pointer' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
        >
            Invia donazione <Icon icon="mdi:heart" className={showSuccessBox ? "text-red-500" : "text-slate-400"} />
        </button>
        
        <button onClick={onClose} className="mt-3 text-xs text-slate-400 font-bold hover:text-slate-600">
            Annulla
        </button>

      </div>
    </div>
  );
}