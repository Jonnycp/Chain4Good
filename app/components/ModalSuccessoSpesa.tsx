import { Icon } from '@iconify/react';
import { Button } from "@heroui/react";
import logo from "~/assets/logo.png";

interface ModalSuccessoSpesaProps {
  onClose: () => void;
}

export default function ModalSuccessoSpesa({ onClose }: ModalSuccessoSpesaProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-appearance-in">
      <div className="bg-white rounded-[32px] w-full max-w-sm p-8 text-center shadow-2xl flex flex-col items-center">
    
        <div className="mb-6 relative">
            <img src={logo} alt="Successo" className="w-32 h-32 object-contain" />
        </div>

        <h2 className="text-3xl font-extrabold text-[#0F172A] mb-2">
          Ottimo!
        </h2>
        
        <p className="text-lg text-[#0F172A] font-medium leading-tight mb-8">
          Spesa aggiunta<br/>con successo!
        </p>

        <Button 
            className="w-full h-12 bg-[#0F172A] text-white font-bold text-base rounded-xl shadow-lg"
            onPress={onClose}
        >
            Torna indietro
        </Button>

      </div>
    </div>
  );
}