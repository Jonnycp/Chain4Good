import { useNavigate } from 'react-router-dom';
import logoChain4Good from '~/assets/logo.png'; 

interface HeaderProps {
  type: 'utente' | 'ente';
  profileImage: string;
  activePage?: 'home' | 'donazioni' | 'profilo';
  showNav?: boolean; // <--- NUOVA PROP OPZIONALE
}

export default function Header({ 
  type, 
  profileImage, 
  activePage = 'home',
  showNav = true // <--- DEFAULT: TRUE (Mostra sempre il menu se non specificato diversamente)
}: HeaderProps) {
  const navigate = useNavigate();
  const isEnte = type === 'ente';
  const profilePath = '/pagina-profilo'; 

  const NavLink = ({ label, page, path }: { label: string, page: string, path: string }) => {
    const isActive = activePage === page;
    return (
      <button 
        onClick={() => navigate(path)}
        className={`text-sm font-bold transition-colors ${
          isActive 
            ? 'text-secondary'
            : 'text-gray-400 hover:text-primary'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="w-full h-20 flex items-center justify-between px-6 md:px-12 bg-white md:bg-transparent z-40">
      
      {/* LOGO */}
      <div 
        className="flex items-center gap-2 cursor-pointer z-10 shrink-0" 
        onClick={() => navigate('/')}
      >
        <img 
            src={logoChain4Good} 
            alt="Chain4Good Logo" 
            className="h-8 md:h-9 w-auto object-contain" 
        />
        <h1 className="text-lg md:text-xl font-extrabold text-secondary tracking-tight">
             Chain<span className="text-primary">4</span>Good
        </h1>
      </div>
    
      <div className="flex items-center gap-6">
        
        {/* MENU LINK: MOSTRA SOLO SE showNav è TRUE */}
        {!isEnte && showNav && (
          <div className="hidden md:flex items-center gap-6">
              <NavLink label="Esplora" page="home" path="/" />
              <NavLink label="Donazioni" page="donazioni" path="/donazioni-utente" />
              <NavLink label="Profilo" page="profilo" path="/pagina-profilo" />
          </div>
        )}

        {/* AVATAR (Rimane sempre) */}
        <div 
            onClick={() => navigate(profilePath)}
            className={`
              w-10 h-10 rounded-full cursor-pointer transition-transform hover:scale-105 shrink-0
              ${isEnte 
                  ? 'bg-gradient-to-tr from-primary to-blue-900 p-[2px]' 
                  : `bg-primary flex items-center justify-center border border-primary ${activePage === 'profilo' ? 'ring-2 ring-offset-2 ring-primary' : ''}`
              }
            `}
        >
           {isEnte ? (
               <div className="w-full h-full rounded-full bg-white p-[1px] overflow-hidden">
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
               </div>
           ) : (
               <div className="w-full h-full rounded-full overflow-hidden">
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
               </div>
           )}
        </div>
      </div>

    </div>
  );
}