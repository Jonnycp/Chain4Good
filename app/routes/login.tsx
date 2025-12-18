import foglia from "../assets/foglia.png";
import logo from "../assets/logo.png";
import ConnectWalletButton from "../components/ConnectWalletButton";
import { redirect, type ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const message = formData.get("message");
  const signature = formData.get("signature");

  try {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/auth/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": request.headers.get("Cookie") || "",
        },
        body: JSON.stringify({
          message: JSON.parse(message as string),
          signature,
        }),
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("Errore di verifica della firma:", data.error, data.code);
      return { error: data?.error || "Verifica fallita" };
    } else {
      const setCookieHeader = response.headers.get("set-cookie");
      return redirect("/", {
        headers: setCookieHeader ? { "Set-Cookie": setCookieHeader } : {},
      });
    }
  } catch (err) {
    console.error("Errore durante la verifica della firma:", err);
    return { error: "Errore di connessione al server" };
  }
}

export default function Login() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4 py-8 font-sans">
      <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-8">
        Chain<span className="text-primary">4</span>Good
      </h1>
      <img
        src={logo}
        alt="Chain4Good Logo"
        className="w-48 md:w-56 h-auto mb-8 object-contain"
      />
      <p className="text-xl text-secondary text-center mb-10 leading-relaxed font-medium">
        Fai la differenza con la <br />
        BlockChain
      </p>

      <ConnectWalletButton />

      <div className="relative w-full max-w-md flex flex-col items-center text-center mt-6">
        <img
          src={foglia}
          alt="Sfondo Foglia"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 opacity-90 pointer-events-none z-0"
        />
        <div className="relative z-10 space-y-6 text-secondary text-sm md:text-base font-medium">
          <p className="px-6 leading-relaxed">
            L’accesso con MetaMask permette di collegare automaticamente il
            proprio wallet
          </p>

          <p>
            Non possiedi un account MetaMask?
            <br />
            <a
              href="https://metamask.io/"
              target="_blank"
              rel="noreferrer"
              className="underline font-bold text-secondary hover:text-primary decoration-2 underline-offset-2 transition-colors"
            >
              Creane uno adesso!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
