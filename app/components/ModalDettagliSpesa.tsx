import { Icon } from '@iconify/react';

interface ModalDettagliSpesaProps {
  spesa: any;
  onClose: () => void;
}

export default function ModalDettagliSpesa({ spesa, onClose }: ModalDettagliSpesaProps) {
  
  const isApproved = spesa.stato === 'approvata';
  const isRejected = spesa.stato === 'rifiutata';

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-appearance-in"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-[32px] w-full max-w-md p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Stato */}
        <h2 className="text-sm font-bold text-center mb-1 uppercase tracking-wider text-[#0F172A]">
            {isApproved ? 'SPESA APPROVATA' : isRejected ? 'SPESA NEGATA' : 'SPESA IN ATTESA'}
        </h2>

        {/* Titolo e Importo */}
        <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-secondary leading-tight mb-2 px-4">{spesa.titolo}</h3>
            <div className="text-4xl font-extrabold text-[#0F172A]">
                {spesa.importo} <span className="text-xl font-normal text-gray-500">{spesa.valuta}</span>
            </div>
        </div>

        {/* Descrizione DINAMICA */}
        <p className="text-xs text-gray-500 text-justify mb-6 leading-relaxed">
            {spesa.descrizione || "Descrizione non fornita per questa spesa."}
        </p>

        {/* Allegati DINAMICI */}
        <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A] underline decoration-slate-300 cursor-pointer hover:text-primary">
                <Icon icon="mdi:paperclip" className="text-lg" /> 
                {/* Usa il nome file reale o un fallback */}
                {spesa.fileName || "Preventivo.pdf"}
            </div>
            {isApproved && (
                 <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A] underline decoration-slate-300 cursor-pointer hover:text-primary">
                    <Icon icon="mdi:paperclip" className="text-lg" /> FurgoneNuovooooo.png
                </div>
            )}
        </div>

        {/* Informazioni */}
        <div className="mb-6 space-y-2">
            <h4 className="text-sm font-bold text-[#0F172A] mb-2">Informazioni</h4>
            
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <Icon icon="mdi:clock-outline" /> Pubblicata il {spesa.dataPubblicazione || '12/12/2025'}
            </div>
            
            {/* VOTI DINAMICI (Usano 0 se non definiti) */}
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <Icon icon="mdi:thumb-down" className="text-lg" /> 
                Ha ricevuto {spesa.votiNegativi || 0} voti negativi
            </div>

             <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <Icon icon="mdi:thumb-up" className="text-lg" /> 
                Ha ricevuto {spesa.votiPositivi || 0} voti positivi
            </div>
            
            {isApproved && (
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <Icon icon="mdi:swap-horizontal" className="text-lg" /> Transazione avvenuta il 13/12/2025
                </div>
            )}
        </div>

        {/* Hash Transazione (Solo Approvata) */}
        {isApproved && (
            <div className="bg-gray-100 rounded-xl p-3 flex items-center justify-between gap-2 mb-4">
                <Icon icon="mdi:link-variant" className="text-gray-400 text-xl" />
                <span className="text-[10px] font-mono text-gray-500 truncate w-full">
                    0x75df0e14e8a785798550ea67413f7f843eda38c73516260634fc5c8daf4c86aa
                </span>
                <Icon icon="mdi:content-copy" className="text-gray-400 text-lg cursor-pointer hover:text-secondary" />
            </div>
        )}

        {/* Motivo Rifiuto (Solo Negata) */}
        {isRejected && (
            <div className="mb-4">
                <h4 className="text-sm font-bold text-[#0F172A] mb-2">Motivo</h4>
                <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                    <Icon icon="mdi:format-quote-close" className="text-2xl text-[#0F172A] rotate-180 flex-shrink-0" />
                    <p className="text-sm font-bold text-[#0F172A] mt-1">Non coerente al progetto</p>
                </div>
            </div>
        )}

    </div>
    </div>
  );
}