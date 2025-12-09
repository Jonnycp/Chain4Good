import React from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  active?: 'home' | 'donazioni' | 'profilo';
}

const Navbar = ({ active = 'home' }: NavbarProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-8 flex justify-between items-end z-50 rounded-t-[30px] shadow-[0_-5px_20px_rgba(0,0,0,0.03)] h-[90px] pb-4">
        
      {/* --- TASTO HOME --- */}
      <button 
        onClick={() => navigate('/')}
        className="relative w-16 h-full flex items-end justify-center focus:outline-none"
      >
        {active === 'home' ? (
          <>
            {/* ARCO VERDE */}
            <div className="absolute bottom-0 w-20 h-[115%] bg-green-600 rounded-t-full rounded-b-none border-[6px] border-white border-b-0 shadow-lg shadow-green-600/20 z-10 flex flex-col items-center justify-center pt-4">
               <Icon icon="mi:home" className="w-9 h-9 text-white mb-1" />
               <span className="text-white text-xs font-bold">Home</span>
            </div>
          </>
        ) : (
          // STATO INATTIVO
          <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors z-20 pb-1">
             <Icon icon="mi:home" className="w-7 h-7" />
             <span className="text-xs font-medium">Home</span>
          </div>
        )}
      </button>

      {/* --- TASTO DONAZIONI --- */}
      <button 
        onClick={() => navigate('/donazioni')} 
        className={`flex flex-col items-center gap-1 transition-colors pb-1 w-16 ${
            active === 'donazioni' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <Icon icon="mdi:clipboard-text-history-outline" className="w-7 h-7" />
        <span className={`text-xs ${active === 'donazioni' ? 'font-bold' : 'font-medium'}`}>
          Donazioni
        </span>
      </button>

      {/* --- TASTO PROFILO --- */}
      <button 
        onClick={() => navigate('/profilo')} 
        className={`flex flex-col items-center gap-1 transition-colors pb-1 w-16 ${
            active === 'profilo' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <Icon icon="bx:user" className="w-7 h-7" />
        <span className={`text-xs ${active === 'profilo' ? 'font-bold' : 'font-medium'}`}>
          Profilo
        </span>
      </button>

    </div>
  );
};

export default Navbar;