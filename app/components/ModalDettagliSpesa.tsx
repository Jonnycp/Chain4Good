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
        <h2 className="text-sm font-bold text-center mb-1 uppercase tracking-wider text-[#0F172A]">
            {isApproved ? 'SPESA APPROVATA' : isRejected ? 'SPESA NEGATA' : 'SPESA IN ATTESA'}
        </h2>

        <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-secondary leading-tight mb-2 px-4">{spesa.titolo}</h3>
            <div className="text-4xl font-extrabold text-[#0F172A]">
                {spesa.importo} <span className="text-xl font-normal text-gray-500">{spesa.valuta}</span>
            </div>
        </div>

        {/* Descrizione Dinamica */}
        <p className="text-xs text-gray-500 text-justify mb-6 leading-relaxed">
            {spesa.descrizione || "Nessuna descrizione fornita."}
        </p>

        {/* File Dinamico */}
        <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A] underline decoration-slate-300 cursor-pointer">
                <Icon icon="mdi:paperclip" className="text-lg" /> 
                {spesa.fileName || "Documento.pdf"}
            </div>
        </div>

        {/* Info Voti Dinamici */}
        <div className="mb-6 space-y-2">
            <h4 className="text-sm font-bold text-[#0F172A] mb-2">Informazioni</h4>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <Icon icon="mdi:clock-outline" /> Pubblicata il {spesa.dataPubblicazione || "Oggi"}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <Icon icon="mdi:thumb-down" className="text-lg" /> Ha ricevuto {spesa.votiNegativi || 0} voti negativi
            </div>
             <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <Icon icon="mdi:thumb-up" className="text-lg" /> Ha ricevuto {spesa.votiPositivi || 0} voti positivi
            </div>
        </div>
    </div>
    </div>
  );
}