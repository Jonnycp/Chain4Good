import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

interface NavbarProps {
  active?: 'home' | 'donazioni' | 'profilo';
}

const NavItem = ({ 
  isActive, 
  onClick, 
  icon, 
  label 
}: { 
  isActive: boolean; 
  onClick: () => void; 
  icon: string; 
  label: string; 
}) => (
  <button 
    onClick={onClick}
    className="relative w-20 h-full flex items-end justify-center focus:outline-none"
  >
    {isActive ? (
      <div className="absolute bottom-0 w-full h-[90%] bg-primary rounded-t-3xl shadow-inner flex flex-col items-center justify-center pb-1 animate-appearance-in">
         <Icon icon={icon} className="w-8 h-8 text-white mb-1" />
         <span className="text-white text-[10px] font-bold tracking-wide">{label}</span>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors z-20 pb-3">
         <Icon icon={icon} className="w-7 h-7" />
         <span className="text-[10px] font-medium">{label}</span>
      </div>
    )}
  </button>
);

const Navbar = ({ active = 'home' }: NavbarProps) => {
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <></>;
  }

  return (
    // NOTA: Aggiunto 'md:hidden' per nascondere la bottom bar su desktop
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 flex justify-between items-end z-50 rounded-t-[30px] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] h-[80px] md:hidden">
        
      <NavItem 
        isActive={active === 'home'}
        onClick={() => navigate('/')}
        icon="mi:home"
        label="Home"
      />

      <NavItem 
        isActive={active === 'donazioni'}
        onClick={() => navigate('/donazioni-utente')}
        icon="mdi:clipboard-text-history-outline"
        label="Donazioni"
      />

      <NavItem 
        isActive={active === 'profilo'}
        onClick={() => navigate('/pagina-profilo')}
        icon="bx:user"
        label="Profilo"
      />

    </div>
  );
};

export default Navbar;