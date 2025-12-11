import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { Button } from "@heroui/react";

interface ModalNuovaSpesaProps {
  onClose: () => void;
  onSuccess: (nuovaSpesa: any) => void;
}

export default function ModalNuovaSpesa({ onClose, onSuccess }: ModalNuovaSpesaProps) {
  const [formData, setFormData] = useState({
    nome: '',
    importo: '',
    descrizione: '',
    file: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, file: 'Il file deve essere un PDF.' }));
        return;
      }
      setFormData(prev => ({ ...prev, file: file }));
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Validazione Nome: Maiuscola iniziale + min 3 caratteri
    if (!formData.nome) {
      newErrors.nome = "Il nome è obbligatorio.";
    } else if (formData.nome.length < 3) {
      newErrors.nome = "Minimo 3 caratteri.";
    } else if (!/^[A-Z]/.test(formData.nome)) {
      newErrors.nome = "Deve iniziare con una maiuscola.";
    }

    // Validazione Importo: > 0
    const importoNum = parseFloat(formData.importo);
    if (!formData.importo || isNaN(importoNum) || importoNum <= 0) {
      newErrors.importo = "Inserisci un importo valido > 0.";
    }

    // Validazione Descrizione
    if (!formData.descrizione.trim()) {
      newErrors.descrizione = "La descrizione è obbligatoria.";
    }

    // Validazione File
    if (!formData.file) {
      newErrors.file = "Allegare un preventivo PDF è obbligatorio.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Creo l'oggetto spesa
      const nuovaSpesa = {
        id: Date.now(),
        titolo: formData.nome,
        importo: parseFloat(formData.importo),
        valuta: "USDC",
        giorni: 30, // Default scadenza
        stato: "attesa",
        descrizione: formData.descrizione,
        fileName: formData.file ? formData.file.name : "Preventivo.pdf",
        dataPubblicazione: new Date().toLocaleDateString('it-IT'),
        votiPositivi: 0,
        votiNegativi: 0
      };
      
      onSuccess(nuovaSpesa);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-appearance-in">
      <div className="bg-white rounded-[32px] w-full max-w-md p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        
        <h2 className="text-xl font-bold text-[#0F172A] text-center mb-6">Nuova spesa</h2>
        
        <div className="space-y-5">
            {/* Nome Spesa */}
            <div>
                <div className="flex items-center text-[#0F172A] font-bold text-sm mb-1 gap-1">
                    <Icon icon="mdi:cart-outline" /> Nome spesa
                </div>
                <input 
                    type="text" 
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className={`w-full h-12 rounded-xl border px-4 focus:ring-1 focus:ring-[#0F172A] outline-none transition-colors ${errors.nome ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                />
                {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
            </div>

            {/* Importo */}
            <div>
                <div className={`border rounded-xl p-4 flex items-center justify-between ${errors.importo ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}>
                    <Icon icon="mdi:currency-eur" className="text-3xl text-[#0F172A]" />
                    <input 
                        type="number" 
                        name="importo"
                        value={formData.importo}
                        onChange={handleChange}
                        placeholder="0,00"
                        className="text-right text-4xl font-extrabold text-[#0F172A] w-full outline-none bg-transparent placeholder:text-slate-300"
                    />
                </div>
                {errors.importo && <p className="text-red-500 text-xs mt-1">{errors.importo}</p>}
            </div>

            {/* Info Box */}
            <div className="bg-[#A6CF98] rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
                <div className="z-10 relative">
                    <p className="text-xs font-bold text-[#1E293B]">La tua spesa verrà valutata</p>
                    <p className="text-[10px] text-[#1E293B] leading-tight mt-0.5">Prima di sbloccare i fondi,<br/>dovrà essere approvata dai donatori</p>
                </div>
                <Icon icon="mdi:medal" className="text-[#1E293B] opacity-80 text-4xl z-10" />
            </div>

            {/* Descrizione */}
            <div>
                <div className="flex items-center text-[#0F172A] font-bold text-sm mb-1 gap-1">
                    <Icon icon="mdi:message-text-outline" /> Descrizione spesa
                </div>
                <textarea 
                    name="descrizione"
                    rows={3}
                    value={formData.descrizione}
                    onChange={handleChange}
                    className={`w-full rounded-xl border p-3 focus:ring-1 focus:ring-[#0F172A] outline-none resize-none transition-colors ${errors.descrizione ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                />
                {errors.descrizione && <p className="text-red-500 text-xs mt-1">{errors.descrizione}</p>}
            </div>

            {/* File PDF */}
            <div>
                <div className="flex items-center text-[#0F172A] font-bold text-sm mb-1 gap-1">
                    <Icon icon="mdi:paperclip" /> Allega preventivo
                </div>
                <input 
                    type="file" 
                    accept="application/pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full h-12 rounded-xl border bg-white flex items-center px-4 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${errors.file ? 'border-red-500 text-red-500' : 'border-slate-300 text-slate-400'}`}
                >
                    {formData.file ? (
                        <span className="text-[#0F172A] font-medium truncate">{formData.file.name}</span>
                    ) : (
                        "Seleziona file PDF..."
                    )}
                </div>
                {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
            </div>

            {/* Azioni */}
            <div className="pt-4 flex flex-col gap-3">
                <Button 
                    className="w-full h-14 bg-[#56A836] text-white font-bold text-lg rounded-xl shadow-lg"
                    onPress={handleSubmit}
                >
                    Invia richiesta
                </Button>
                <button onClick={onClose} className="text-sm font-bold text-slate-400 hover:text-slate-600">
                    Annulla
                </button>
            </div>

        </div>
      </div>
    </div>
  );
}