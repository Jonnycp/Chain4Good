import foglia from '../assets/foglia.png';
import logo from '../assets/logo.png';
import ConnectWalletButton from '../components/ConnectWalletButton'; 

export default function Login() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4 py-8 font-sans">

      <h1 className='text-4xl md:text-5xl font-bold text-secondary mb-8'>
        Chain<span className='text-primary'>4</span>Good
      </h1>

      <img 
        src={logo} 
        alt="Chain4Good Logo" 
        className="w-48 md:w-56 h-auto mb-8 object-contain" 
      />


      <p className='text-xl text-secondary text-center mb-10 leading-relaxed font-medium'>
        Fai la differenza con la <br />
        BlockChain
      </p>

      <ConnectWalletButton />

      <div className="relative w-full max-w-md flex flex-col items-center text-center">
        <img 
          src={foglia} 
          alt="Sfondo Foglia" 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 opacity-25 pointer-events-none -z-10" 
        />

        <div className="relative z-10 space-y-6 text-slate-600 text-sm md:text-base">
          <p className="px-6 leading-relaxed">
            L’accesso con MetaMask permette di collegare automaticamente il proprio wallet
          </p>
          
          <p>
            Non possiedi un account MetaMask??<br/>
            <a href="https://metamask.io/" target="_blank" rel="noreferrer" className="underline font-bold text-[#1f2937] hover:text-[#84cc16] decoration-2 underline-offset-2">
              Creane uno adesso!
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}