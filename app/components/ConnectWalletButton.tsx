import { useState } from "react";
import metamaskLogo from '../assets/metamask-logo.png'; 

export default function ConnectWalletButton() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);

    console.log("Tentativo di connessione a MetaMask...");
    setTimeout(() => setIsConnecting(false), 2000); //simulazione di collegamento 
  };

  return (
    <button 
      onClick={handleConnect}
      disabled={isConnecting}
      className="group flex items-center justify-center gap-3 bg-secondary text-white px-6 py-3.5 rounded-xl shadow-lg hover:bg-primary transition-all w-full max-w-xs mb-12 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isConnecting ? (
        <span className="text-lg">Connessione...</span>
      ) : (
        <>
          <img src={metamaskLogo} alt="MetaMask Logo" className="w-6 h-6" />
          <span className="font-semibold text-lg">Accedi con MetaMask</span>
        </>
      )}
    </button>
  );
}