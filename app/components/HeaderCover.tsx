import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

interface HeaderCoverProps {
  type: 'utente' | 'ente';
  coverImage: string;
  location?: string;
  onShare?: () => void;
  onDelete?: () => void;
}

export default function HeaderCover({ 
  type, 
  coverImage, 
  location, 
  onShare, 
  onDelete 
}: HeaderCoverProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleRightBtnClick = () => {
    if (type === 'utente') {
      if (onShare) onShare();
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  return (
    <div className="relative w-full h-[340px]">
      
      <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent h-32 pointer-events-none" />
      
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 pt-10">
          <button 
            onClick={() => navigate(-1)} 
            className="text-white hover:opacity-80 transition drop-shadow-md"
          >
              <Icon icon="mdi:arrow-left" width="28" />
          </button>

          <div className="relative">
            <button 
                onClick={handleRightBtnClick}
                className="text-white hover:opacity-80 transition drop-shadow-md flex items-center justify-center"
            >
                <Icon icon={type === 'ente' ? "mdi:dots-vertical" : "mdi:share-variant-outline"} width="28" />
            </button>

            {/* DROPDOWN MENU PER ENTE */}
            {isMenuOpen && type === 'ente' && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                    
                    <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl py-2 w-48 z-30 animate-fade-in origin-top-right ring-1 ring-black/5">
                        <button 
                            onClick={() => {
                                if(onShare) onShare();
                                setIsMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-sm font-bold text-secondary hover:bg-slate-50 flex items-center gap-2"
                        >
                            <Icon icon="mdi:share-variant-outline" className="text-lg" /> Condividi
                        </button>
                        
                        <div className="h-px bg-slate-100 my-1 mx-2"></div>

                        <button 
                            onClick={() => {
                                if(onDelete) onDelete();
                                setIsMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                            <Icon icon="mdi:trash-can-outline" className="text-lg" /> Elimina progetto
                        </button>
                    </div>
                </>
            )}
          </div>
      </div>
      {location && (
        <button className="absolute bottom-12 right-6 bg-white px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg z-20 hover:bg-gray-100 transition">
            <Icon icon="solar:map-point-bold" className="text-secondary w-4 h-4" />
            <span className="text-sm font-bold text-secondary">{location}</span>
        </button>
      )}
    </div>
  );
}