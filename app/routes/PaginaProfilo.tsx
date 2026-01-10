import { Icon } from '@iconify/react';

import Header from '../components/Header';
import Navbar from '../components/Navbar';

import { useNavigate, redirect, type ActionFunctionArgs, useSubmit } from "react-router";

import { useApp } from "../context/AppProvider";
import { useBalance, useReadContract } from "wagmi";
import { getAddress, formatEther, formatUnits, erc20Abi } from "viem";

export async function action({ request }: ActionFunctionArgs) {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (typeof window === "undefined") {
    const url = new URL(backendUrl);
    url.hostname = "backend";
    backendUrl = url.toString().replace(/\/$/, "");
  }

  try {
    const response = await fetch(`${backendUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Cookie": request.headers.get("Cookie") || "",
      },
      credentials: "include",
    });

    if (!response.ok) throw new Error("Errore nel logout");

    return redirect("/login", {
      headers: {
        "Set-Cookie": "siwe-session=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax",
      },
    });
  } catch (error) {
    return { error: "Logout fallito" };
  }
}

export default function Profilo() {
  const navigate = useNavigate();
  const submit = useSubmit();

  const { user, contracts } = useApp();

  // Bilancio ETH (per gas)
  const { data: ethBalance } = useBalance({
    address: user?.address ? getAddress(user.address) : undefined,
  });
  
  // Bilancio EURC
  const { data: eurcRawBalance } = useReadContract({
    address: contracts?.eurc ? getAddress(contracts.eurc) : undefined,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: user?.address ? [getAddress(user.address)] : undefined,
    query: {
      enabled: !!user?.address && !!contracts?.eurc,
      refetchInterval: 3000,
    }
  });
  // Formattazione manuale (i MockERC20 hanno 18 decimali)
  const eurcFormatted = eurcRawBalance 
  ? parseFloat(formatUnits(eurcRawBalance as bigint, 18)).toLocaleString('it-IT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  : "0,00";

  return (
    <div className={`min-h-screen bg-white font-sans text-secondary ${user?.isEnte ? 'pb-10' : 'pb-28'} relative`}>
      
      <Header 
        type={user?.isEnte ? 'ente' : 'utente'} 
        profileImage={user?.profilePicture || ''} 
        activePage="profilo"
      />

      <main className="w-full max-w-lg mx-auto px-6 mt-4">
        <h2 className="text-2xl font-extrabold text-secondary mb-8">Il tuo profilo</h2>
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            {user?.isEnte ? (
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-green-400 to-blue-600 p-[3px]">
                    <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
                        <img 
                          src={user?.profilePicture} 
                          alt={user?.username}
                          className="w-full h-full object-cover rounded-full bg-slate-900"
                        />
                    </div>
                </div>
            ) : (
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-transparent">
                    <img src={user?.profilePicture} alt={user?.username} className="w-full h-full object-cover" />
                </div>
            )}
            <button className={`absolute bottom-1 right-2 text-white rounded-full p-1 border-2 border-white shadow-md flex items-center justify-center ${user?.isEnte ? 'bg-green-600' : 'bg-primary'}`}>
              <Icon icon="mdi:plus" width="18" />
            </button>
          </div>
          
          <button className="mt-3 text-xs font-bold text-secondary hover:text-primary transition-colors">
            Modifica immagine o avatar
          </button>
        </div>

        {/* WALLET */}
        <div className="border border-slate-200 rounded-2xl py-6 px-4 text-center shadow-sm mb-10 bg-white">
          <p className="text-slate-600 font-bold text-sm mb-1">Nel wallet hai disponibili</p>
          <div className="text-4xl font-bold text-primary flex justify-center items-baseline gap-1">
            {eurcFormatted ? eurcFormatted : "0.00"} <span className="text-lg font-semibold">EURC</span>
          </div>
          <div className="text-2xl font-bold text-secondary flex justify-center items-baseline gap-1">
            {ethBalance ? formatUnits(ethBalance.value, ethBalance.decimals).substring(0, 6) : "0.00"} <span className="text-lg font-semibold">ETH</span>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-1/2 space-y-2">
              <label className="text-secondary font-extrabold text-sm">
                  {user?.isEnte ? "Nome ente" : "Nome utente"}
              </label>
              <div className="flex items-center bg-[#F3F4F6] rounded-xl px-3 h-12">
                <Icon icon={user?.isEnte ? "lucide:user" : "mdi:user-outline"} className="text-slate-900 text-lg mr-2" />
                <span className="text-slate-600 font-medium truncate text-sm">{user?.isEnte ? user?.enteDetails?.nome : user?.username}</span>
              </div>
            </div>
            <div className="w-1/2 space-y-2">
              <label className="text-secondary font-extrabold text-sm">Wallet</label>
              <div className="flex items-center bg-[#F3F4F6] rounded-xl px-3 h-12 cursor-pointer" onClick={() => navigator.clipboard.writeText(user?.address || "")}>
                <Icon icon="mdi:link-variant" className="text-slate-900 text-lg mr-2" />
                <span className="text-slate-600 font-medium truncate text-sm">
                    {user?.address}
                </span>
              </div>
            </div>
          </div>
          {user?.isEnte && (
              <div className="space-y-2">
                <label className="text-secondary font-extrabold text-sm">Denominazione sociale</label>
                <div className="flex items-center bg-[#F3F4F6] rounded-xl px-3 h-12">
                  <Icon icon="ic:baseline-people" className="text-slate-900 text-xl mr-2" />
                  <span className="text-slate-600 font-medium text-sm truncate">{user.enteDetails?.denominazioneSociale}</span>
                </div>
              </div>
          )}
          <div className="space-y-2">
            <label className="text-secondary font-extrabold text-sm">
                E-mail <span className="font-normal text-slate-500">(facoltativo)</span>
            </label>
            <div className="flex items-center bg-[#F3F4F6] rounded-xl px-3 h-12">
              <Icon icon="mdi:email-outline" className="text-slate-900 text-lg mr-2" />
              <input 
                type="email" 
                value={user?.email || ""} 
                readOnly
                className="bg-transparent text-slate-600 font-medium w-full outline-none text-sm"
              />
            </div>
          </div>

        </div>
        <div className="mt-12 flex gap-3">
          {user?.isEnte ? (
            <>
                <button 
                    onClick={() => navigate(-1)}
                    className="bg-[#1D3D5A] text-white w-14 h-14 rounded-xl shadow-lg flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
                >
                    <Icon icon="mdi:arrow-left" width="24" />
                </button>

                <button 
                    onClick={() => submit(null, { method: "post" })}
                    className="bg-[#1D3D5A] text-white h-14 rounded-xl shadow-lg flex-1 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform text-lg"
                >
                    <Icon icon="mdi:logout-variant" width="20" />
                    Esci
                </button>
            </>
          ) : (
            <button 
                onClick={() => submit(null, { method: "post" })}
                className="w-full bg-secondary text-white font-bold text-lg py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform hover:bg-slate-800"
            >
                <Icon icon="mdi:logout-variant" className="text-xl rotate-180" /> 
                Esci
            </button>
          )}
        </div>
        
      </main>

      {/* NAVBAR */}
      {!user?.isEnte && <Navbar active="profilo"/>}

    </div>
  );
}