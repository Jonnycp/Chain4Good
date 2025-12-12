import { useNavigate } from 'react-router-dom';
import logoChain4Good from '~/assets/logo.png'; 

interface HeaderProps {
  type: 'utente' | 'ente';
  profileImage: string;
}

export default function Header({ type, profileImage }: HeaderProps) {
  const navigate = useNavigate();

  const isEnte = type === 'ente';
  const profilePath = isEnte ? '/profilo-ente' : '/profilo-utente';

  return (
    <div className="flex justify-between items-center px-6 pt-8 pb-4 bg-white sticky top-0 z-40">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => navigate('/')}
      >
        <img 
            src={logoChain4Good} 
            alt="Chain4Good Logo" 
            className="h-8 w-auto object-contain" 
        />
        <span className="text-xl font-extrabold text-secondary tracking-tight">
             Chain<span className="text-primary">4</span>Good
        </span>
      </div>
    
      <div 
          onClick={() => navigate(profilePath)}
          className={`
            w-10 h-10 rounded-full cursor-pointer transition-transform hover:scale-105
            ${isEnte 
                ? 'bg-gradient-to-tr from-primary to-blue-900 p-[2px]' 
                : 'bg-primary flex items-center justify-center border border-primary'
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
  );
}