import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { erc20Abi, formatUnits, getAddress, parseUnits } from "viem";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useWriteContract, useConfig, useReadContract } from "wagmi";
import vaultAbi from "@abi/ProjectVault.sol/ProjectVault.json";
import { useQueryClient } from "@tanstack/react-query";
import { useApp } from "~/context/AppProvider";

export default function PopoverDona({
  onClose,
  currentAmount,
  targetAmount,
  currency,
  vaultAddress,
  projectId,
}: {
  onClose: (amount?: number) => void;
  currentAmount: number;
  targetAmount: number;
  currency: string;
  vaultAddress: string;
  projectId: string;
}) {
  const [amountStr, setAmountStr] = useState<string>("");
  const [statusText, setStatusText] = useState("");
  const [showSuccessBox, setShowSuccessBox] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const missing = Math.max(targetAmount - currentAmount, 0);
  const writeContract = useWriteContract();
  const config = useConfig();
  const queryClient = useQueryClient();
  const { contracts, user } = useApp();

  const { data: eurcBalance } = useReadContract({
    address: contracts?.eurc ? getAddress(contracts.eurc) : undefined,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: user?.address ? [getAddress(user.address)] : undefined,
    query: {
      enabled: !!user?.address && !!contracts?.eurc,
    },
  });

  const handleConfirm = async () => {
    if (isDisabled) return;
    if (parseFloat(amountStr) + currentAmount > targetAmount) return;
    setIsPending(true);

    try {
      setStatusText("Eseguo transazione...");
      const amountUnits = parseUnits(amountStr, 18);

      const donateHash = await writeContract.mutateAsync({
        address: vaultAddress as `0x${string}`,
        abi: vaultAbi.abi,
        functionName: "donate",
        args: [amountUnits],
      });

      await waitForTransactionReceipt(config, { hash: donateHash });

      // Callback per aggiornare il DB
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/donate`, {
        method: "POST",
        body: JSON.stringify({
          amount: amountStr,
          hashTransaction: donateHash,
          messaggio: message,
        }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Donazione eseguita, ma errore nel salvataggio.");
        setStatusText("Donazione eseguita, ma errore nel salvataggio.");
        return;
      }
      queryClient.invalidateQueries({
        queryKey: [["project-donations", projectId], ["projects"]],
        type: "all",
      });
      setIsPending(false);
      setStatusText("Donazione completata!");
      setShowSuccessBox(true);
      onClose(parseFloat(amountStr));
    } catch (err) {
      console.error(err);
      setStatusText("Errore transazione");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Gestione input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val) || val === "") {
      setAmountStr(val);
    } else {
      return;
    }
  };

  // Calcolo valore numerico per controlli
  const hasEnoughEurc = eurcBalance
    ? eurcBalance >= parseUnits(amountStr || "0", 18)
    : false;

  const isDisabled =
    isPending ||
    amountStr === "" ||
    isNaN(parseFloat(amountStr)) ||
    parseFloat(amountStr) <= 0 ||
    parseFloat(amountStr) > missing ||
    !hasEnoughEurc;

  // Genera preset dinamici: 5%, 10%, 15% del missing
  const available = eurcBalance
    ? parseFloat(formatUnits(eurcBalance as bigint, 18))
    : 0;
  const maxDonable = Math.min(missing, available);
  const dynamicPresets = [
    Math.ceil(maxDonable * 0.05),
    Math.ceil(maxDonable * 0.1),
    Math.ceil(maxDonable * 0.15),
  ].filter((val, idx, arr) => val > 0 && arr.indexOf(val) === idx);

  const presets = [...dynamicPresets, 10, 20, 100]
    .filter((val, idx, arr) => val > 0 && arr.indexOf(val) === idx)
    .filter((val) => val <= missing)
    .filter((val) => val <= available)
    .sort((a, b) => a - b);

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-appearance-in">
      {/* Overlay click to close */}
      {!isPending && <div className="absolute inset-0" onClick={() => onClose()}></div>}

      <div className="bg-white rounded-[32px] w-full max-w-sm p-6 relative shadow-2xl flex flex-col animate-slide-up sm:animate-none z-10">
        <h2 className="text-lg font-extrabold text-secondary text-center mb-6 mt-2">
          Quanto vuoi donare al progetto?
        </h2>
        {/* Presets */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {presets.map((val) => (
            <button
              key={"preset"+val}
              onClick={() => setAmountStr(val.toString())}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                amountStr === val.toString()
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-white text-slate-500 border-slate-200 hover:border-primary"
              }`}
            >
              {val} <span className="text-[10px]">{currency}</span>
            </button>
          ))}
        </div>

        {/* Input Personalizzabile - ALLINEATO A DESTRA */}
        <div className="relative mb-6 border-b-2 border-slate-100 pb-2 flex items-center justify-between group focus-within:border-primary transition-colors">
          {/* Icona Euro a sinistra */}
          <Icon
            icon="mdi:currency-eur"
            className="text-4xl text-secondary opacity-20 pointer-events-none mr-2"
          />

          <div className="flex items-center justify-end w-full">
            {/* Input: text-right per allineare i numeri a destra */}
            <input
              type="number"
              value={amountStr}
              onChange={handleInputChange}
              placeholder="0"
              className="w-full text-4xl font-extrabold text-secondary bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-slate-200 text-right pr-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />

            {/* Suffisso fisso estetico */}
            <span className="text-xl font-bold text-secondary opacity-40 mb-1 mr-2">
              ,00
            </span>

            <span className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap mb-1">
              {currency}
            </span>
          </div>
        </div>

        {/* Box Congratulazioni (Condizionale) */}
        {showSuccessBox ? (
          <div className="bg-[#E7F6E9] rounded-xl p-4 mb-6 flex items-center justify-between relative overflow-hidden animate-appearance-in">
            <div className="relative z-10 max-w-[80%]">
              <p className="text-xs font-bold text-secondary mb-0.5">
                Congratulazioni!
              </p>
              <p className="text-[10px] text-slate-600 leading-tight">
                Contribuirai attivamente a tutte le spese del progetto
              </p>
            </div>
            <Icon
              icon="mdi:medal"
              className="text-secondary text-3xl opacity-80"
            />
            <div className="absolute -top-2 right-10 w-4 h-4 bg-[#E7F6E9] rotate-45 transform"></div>
          </div>
        ) : (
          <div className="mb-6 h-4"></div>
        )}

        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm text-secondary font-bold mb-2">
            <Icon icon="mdi:message-outline" /> Aggiungi messaggio
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-primary resize-none h-24"
          />
        </div>
        <button
          onClick={handleConfirm}
          disabled={isDisabled}
          className={`w-full font-bold text-lg py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            !isDisabled
              ? "bg-primary hover:bg-green-700 text-white cursor-pointer"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
            {isPending ? (
            <>
              <Icon icon="mdi:loading" className="animate-spin text-2xl" />
              <span className="text-sm uppercase tracking-wider">
              {statusText}
              </span>
            </>
            ) : parseFloat(amountStr) > missing ? (
            <>
              <Icon icon="mdi:alert-circle-outline" className="text-yellow-500" />
              Oltre il target massimo
            </>
            ) : hasEnoughEurc ? (
            <>
              Invia donazione <Icon icon="mdi:heart" className="text-red-500" />
            </>
            ) : (
            <>
              <Icon icon="material-symbols:wallet" className="text-slate-400" />
              Fondi insufficienti
            </>
            )}
        </button>

        {!isPending && (
          <button
            onClick={() => onClose()}
            className="mt-3 text-xs text-slate-400 font-bold hover:text-slate-600"
          >
            Annulla
          </button>
        )}
      </div>
    </div>
  );
}
