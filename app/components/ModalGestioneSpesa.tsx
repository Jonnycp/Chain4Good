import { useState } from 'react';
import { Icon } from '@iconify/react';

interface ModalGestioneSpesaProps {
  spesa: any;
  onClose: () => void;
  onUpdateStatus: (id: number, status: 'approvata' | 'rifiutata') => void;
}

type ViewState = 'details' | 'rejecting' | 'approved_feedback';

export default function ModalGestioneSpesa({ spesa, onClose, onUpdateStatus }: ModalGestioneSpesaProps) {
  const [view, setView] = useState<ViewState>('details');
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = () => {
    setView('approved_feedback');
    // Qui chiameresti l'API reale
  };

  const handleRejectClick = () => {
    setView('rejecting');
  };

  const confirmReject = () => {
    onUpdateStatus(spesa.id, 'rifiutata');
    onClose();
  };

  const confirmApproveFinal = () => {
    onUpdateStatus(spesa.id, 'approvata');
    onClose();
  };

  const resetChoice = () => {
    setView('details');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-appearance-in font-sans">
      <div className="bg-white rounded-[32px] w-full max-w-sm p-8 text-center shadow-2xl flex flex-col items-center relative animate-slide-up">
        
        {/* Header */}
        <h2 className="text-xs font-bold tracking-widest uppercase mb-4 text-secondary">
          Richiesta di Spesa
        </h2>

        {/* Titolo e Importo */}
        <h3 className="text-sm font-bold text-slate-800 mb-2">{spesa.titolo}</h3>
        <div className="text-4xl font-extrabold text-slate-900 mb-4 flex items-center justify-center gap-1">
            {spesa.importo} <span className="text-sm font-bold text-slate-500 mt-3">{spesa.valuta}</span>
        </div>

        {/* Descrizione */}
        <p className="text-xs text-slate-500 leading-relaxed mb-4 px-2">
            {spesa.descrizione || "Grazie al furgone potremmo andare a ricercare i trovatelli in giro per la città di Bari."}
        </p>

        {/* Allegato */}
        <div className="flex items-center gap-2 mb-6 cursor-pointer hover:underline">
            <Icon icon="mdi:paperclip" className="text-slate-900" />
            <span className="text-xs font-bold text-slate-900 underline decoration-slate-900">{spesa.fileName || "Preventivo-1.pdf"}</span>
        </div>

        {view !== 'rejecting' && (
            <>
                {/* Sezione Info Voto */}
                <div className="w-full mb-6">
                    <p className="text-sm font-bold text-secondary mb-2">Valuta se è una spesa appropriata</p>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-2">
                        <Icon icon="mdi:clock-outline" /> Pubblicata il {spesa.dataPubblicazione}
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                        <div className="flex items-center gap-2 text-[10px] text-slate-600 font-medium">
                            <Icon icon="mdi:thumb-up" className="text-slate-900" /> Ha ricevuto finora {spesa.votiPositivi || 23} voti positivi
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-600 font-medium">
                            <Icon icon="mdi:thumb-down" className="text-slate-900" /> Ha ricevuto finora {spesa.votiNegativi || 10} voti negativi
                        </div>
                    </div>
                </div>

                {/* Bottoni Azione */}
                {view === 'details' ? (
                    <div className="flex gap-4 w-full">
                        <button 
                            onClick={handleApprove}
                            className="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-transform active:scale-95 bg-primary hover:opacity-90"
                        >
                            Approva
                        </button>
                        <button 
                            onClick={handleRejectClick}
                            className="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-transform active:scale-95 bg-[#C21C1C] hover:bg-[#a61717]"
                        >
                            Nega
                        </button>
                    </div>
                ) : (
                    //Approvo
                    <div className="w-full animate-fade-in">
                        <button 
                             onClick={confirmApproveFinal}
                             className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 mb-3 bg-secondary hover:opacity-90"
                        >
                            <Icon icon="mdi:thumb-up" className="text-lg" /> Hai approvato la spesa
                        </button>
                        <button onClick={resetChoice} className="text-xs font-bold text-red-600 underline hover:no-underline">
                            Cambia scelta
                        </button>
                    </div>
                )}
            </>
        )}

        {/* Rifiuto */}
        {view === 'rejecting' && (
            <div className="w-full animate-fade-in">
                <p className="text-sm font-bold text-secondary mb-3">Spiega il motivo del rifiuto</p>
                
                <div className="relative mb-6">
                    <select 
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-slate-300"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    >
                        <option value="">Seleziona una motivazione...</option>
                        <option value="costo">Costo troppo elevato</option>
                        <option value="non_pertinente">Spesa non pertinente</option>
                        <option value="documentazione">Documentazione incompleta</option>
                        <option value="altro">Altro</option>
                    </select>
                    <Icon icon="mdi:chevron-down" className="absolute right-3 top-3.5 text-slate-400" />
                </div>

                <button 
                    onClick={confirmReject}
                    className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 mb-3 bg-secondary hover:opacity-90"
                >
                    <Icon icon="mdi:thumb-down" className="text-lg" /> Conferma negazione
                </button>
                
                <button onClick={resetChoice} className="text-xs font-bold text-red-600 underline hover:no-underline">
                    Cambia scelta
                </button>
            </div>
        )}

      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
}