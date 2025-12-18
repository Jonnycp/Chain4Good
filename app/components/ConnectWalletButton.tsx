import { useNavigation, useSubmit } from "react-router";
import { useConnect, useSignMessage, useConnection } from "wagmi";
import { metaMask } from "@wagmi/connectors";
import { SiweMessage } from "siwe";
import { useMutation } from "@tanstack/react-query";
import { getAddress } from "viem";
import metamaskLogo from "../assets/metamask-logo.png";

export default function ConnectWalletButton() {
  const navigation = useNavigation();
  const submit = useSubmit();

  const { address, isConnected, chainId } = useConnection();
  const connect = useConnect();
  const sign = useSignMessage();

  const getNonceMutation = useMutation({
    mutationFn: async (address: string) => {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/auth/nonce",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Errore server: ${response.status}`);
      }

      const nonce = await response.json();
      if (!nonce.nonce) {
        throw new Error("Il backend ha restituito un nonce vuoto");
      }
      return nonce.nonce;
    },
  });

  const isBusy =
    navigation.state === "submitting" ||
    getNonceMutation.isPending ||
    connect.isPending ||
    sign.isPending;

  const handleLogin = async () => {
    try {
      let activeAddress = address;
      let activeChainId = chainId;

      //Connessione a metamask
      if (!isConnected) {
        const result = await connect.mutateAsync({ connector: metaMask() });
        activeAddress = result.accounts[0];
        activeChainId = result.chainId;
      }

      //Fallback di sicurezza
      if (!activeAddress || !activeChainId)
        throw new Error("Wallet non connesso correttamente.");

      // Ottieni nuovo nonce dal backend (react query) /auth/nonce
      const nonce = await getNonceMutation.mutateAsync(getAddress(activeAddress));
      const cleanNonce = typeof nonce === 'string' ? nonce.trim() : String(nonce);

      // Crea messaggio SIWE
      const siweOptions = {
        domain: window.location.hostname,
        address: getAddress(activeAddress),
        statement: "Accedi a Chain4Good",
        uri: window.location.origin,
        version: "1",
        chainId: Number(activeChainId),
        nonce: String(nonce).trim(),
        issuedAt: new Date().toISOString(),
      };
      const siweMessage = new SiweMessage(siweOptions);

      // Firma messaggio
      const signature = await sign.mutateAsync({
        message: siweMessage.prepareMessage(),
      });

      // Invia all'action (/auth/verify)
      submit(
        {
          message: JSON.stringify(siweMessage),
          signature,
        },
        { method: "post", action: "/login" }
      );
    } catch (error) {
      console.error("Errore di connessione al wallet:", error);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isBusy}
      className="group flex items-center justify-center gap-3 bg-secondary text-white px-6 py-3.5 rounded-xl shadow-lg hover:bg-primary transition-all w-full max-w-xs mb-12 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isBusy ? (
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
