import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import type { Spesa } from "~/context/AppProvider";

import { useWriteContract, useConfig } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import vaultAbi from "@abi/ProjectVault.sol/ProjectVault.json";
import { useQueryClient } from "@tanstack/react-query";

interface ModalSpesaProps {
  spesa: Spesa;
  onClose: () => void;
  currency: string;
  mode: "view" | "manage";
  vaultAddress: `0x${string}`;
  projectId: string;
}

export default function ModalGestioneSpesa({
  spesa,
  onClose,
  currency,
  mode,
  vaultAddress,
  projectId,
}: ModalSpesaProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [negata, setNegata] = useState(false);

  const config = useConfig();
  const writeContract = useWriteContract();
  const [isPending, setIsPending] = useState(false);
  const [statusText, setStatusText] = useState<string>("");
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileProof, setFileProof] = useState<File | null>(null);

  async function getFileHash(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    // Converti in hex string (bytes32)
    return (
      "0x" +
      Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/ogg",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsPending(false);
      setStatusText("");
      const file = e.target.files[0];

      if (!allowedTypes.includes(file.type)) {
        setIsPending(true);
        setStatusText("Il file deve essere un PDF, un'immagine o un video.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setIsPending(true);
        setStatusText("Il file non deve superare i 10MB.");
        return;
      }
      setFileProof(file);
    }
  };

  const vote = async (type: "for" | "against", reason?: string) => {
    if (isPending) return;
    if (type === "against" && !reason) return;
    setIsPending(true);
    setStatusText("Invio voto...");
    try {
      //? 1. BLOCKCHAIN: Chiama la funzione vote sul Vault
      const hash = await writeContract.mutateAsync({
        address: vaultAddress as `0x${string}`,
        abi: vaultAbi.abi,
        functionName: "vote",
        args: [BigInt(spesa.requestId), type === "for"],
      });

      await waitForTransactionReceipt(config, { hash });

      //? 2. BACKEND: Invia il voto al backend
      setStatusText("Salvo voto...");
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/spese/${spesa._id}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vote: type,
            motivation: reason || "",
            hashVote: hash,
          }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.error("Errore nel salvataggio del voto.");
        setStatusText("Errore nel salvataggio del voto.");
        return;
      }
      setStatusText("Voto confermato!");
      queryClient.invalidateQueries({
        queryKey: ["project-spese", projectId],
      });
      setTimeout(() => {
        setIsPending(false);
        onClose();
      }, 1500);
    } catch (err) {
      setStatusText("Voto fallito");
      console.error("Voto fallito", err);
    }
  };

  const executeSpesa = async () => {
    if (isPending) return;
    if (spesa.status !== "approvata") return;
    if (spesa.executed) return;
    setIsPending(true);
    setStatusText("Avviando trasferimento...");
    try {
      //? 1. BLOCKCHAIN: Chiama la funzione executeRequest sul Vault
      const hash = await writeContract.mutateAsync({
        address: vaultAddress as `0x${string}`,
        abi: vaultAbi.abi,
        functionName: "executeRequest",
        args: [BigInt(spesa.requestId)],
      });

      await waitForTransactionReceipt(config, { hash });

      //? 2. BACKEND: Invia l'esecuzione al backend
      setStatusText("Salvo esecuzione...");
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/spese/${spesa._id}/execute`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hashTransaction: hash,
          }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.error("Errore nel salvataggio dell'esecuzione.");
        setStatusText("Errore nel salvataggio dell'esecuzione.");
        return;
      }
      setStatusText("Trasferimento confermato!");
      queryClient.invalidateQueries({
        queryKey: ["project-spese", projectId],
      });
      setTimeout(() => {
        setIsPending(false);
        onClose();
      }, 1500);
    } catch (err) {
      setStatusText("Trasferimento fallito");
      console.error("Trasferimento fallito", err);
    }
  };

  const validateSpesa = async () => {
    if (isPending) return;
    if (spesa.status !== "approvata") return;
    if (!spesa.executed) return;
    if (spesa.proofHash) return;
    if (!fileProof) return;
    if (!allowedTypes.includes(fileProof.type)) {
      setIsPending(true);
      setStatusText("Il file deve essere un PDF, un'immagine o un video.");
      return;
    }

    if (fileProof.size > 10 * 1024 * 1024) {
      setIsPending(true);
      setStatusText("Il file non deve superare i 10MB.");
      return;
    }

    setIsPending(true);
    setStatusText("Caricando prova di spesa...");
    try {
      //? 1. BLOCKCHAIN: Chiama la funzione finalizeRequest sul Vault
      const proofHash = await getFileHash(fileProof);

      const hash = await writeContract.mutateAsync({
        address: vaultAddress as `0x${string}`,
        abi: vaultAbi.abi,
        functionName: "finalizeRequest",
        args: [BigInt(spesa.requestId), proofHash],
      });
      await waitForTransactionReceipt(config, { hash });

      //? 2. BACKEND: Invia l'esecuzione al backend
      setStatusText("Salvo esecuzione...");
      const formData = new FormData();
      formData.append("proof", fileProof);
      formData.append("proofHash", hash);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/spese/${spesa._id}/validate`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.error("Errore nel caricamento della prova di spesa.");
        setStatusText("Errore nel caricamento della prova di spesa.");
        return;
      }
      setStatusText("Prova di spesa caricata con successo!");
      queryClient.invalidateQueries({
        queryKey: ["project-spese", projectId],
      });
      setTimeout(() => {
        setIsPending(false);
        onClose();
      }, 1500);
    } catch (err) {
      setStatusText("Caricamento prova di spesa fallito");
      console.error("Caricamento prova di spesa fallito", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-appearance-in font-sans"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[32px] w-full max-w-md p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className="text-xs font-bold tracking-widest uppercase mb-4 text-secondary text-center">
          {mode === "manage"
            ? "Richiesta di Spesa"
            : spesa.status === "approvata"
              ? "SPESA APPROVATA"
              : spesa.status === "rifiutata"
                ? "SPESA NEGATA"
                : "SPESA IN ATTESA"}
        </h2>

        {/* Titolo e Importo */}
        <h3 className="text-lg font-bold text-secondary leading-tight mb-2 px-4 text-center">
          {spesa.title}
        </h3>
        <div className="text-4xl font-extrabold text-[#0F172A] mb-4 flex items-center justify-center gap-1">
          {spesa.amount}{" "}
          <span className="text-xl font-normal text-gray-500">{currency}</span>
        </div>

        {/* Descrizione */}
        <p className="text-xs text-gray-500 text-justify mb-6 leading-relaxed">
          {spesa.description || "Nessuna descrizione fornita."}
        </p>

        {/* Allegato */}
        <a
          href={import.meta.env.VITE_BACKEND_URL + "/" + spesa.preventivo}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mb-6 cursor-pointer hover:underline text-sm font-bold text-[#0F172A] underline decoration-slate-300"
        >
          <Icon icon="mdi:paperclip" className="text-lg" />
          {spesa.preventivo?.split("/").pop()?.split("-").slice(1).join("-")}
        </a>

        {/* Info */}
        <div className="mb-6 space-y-2">
          <h4 className="text-sm font-bold text-[#0F172A] mb-2">
            Informazioni
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Icon icon="material-symbols:category" width="18" /> Categoria:{" "}
            <b className="italic">{spesa.category}</b>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Icon icon="mdi:clock-outline" width="18" /> Pubblicata il{" "}
            {new Date(spesa.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Icon icon="mdi:thumb-up" className="text-lg" /> Ha ricevuto{" "}
            {spesa.votes.votesFor} voti positivi
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Icon icon="mdi:thumb-down" className="text-lg" /> Ha ricevuto{" "}
            {spesa.votes.votesAgainst} voti negativi
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Icon icon="mingcute:link-fill" className="text-lg" /> Transazione
            di creazione{" "}
            <span
              className="cursor-pointer italic underline"
              onClick={() => {
                navigator.clipboard.writeText(spesa.hashCreation);
                alert("Hash copiato negli appunti!" + spesa.hashCreation);
              }}
            >
              {spesa.hashCreation.slice(0, 10)}...
              {spesa.hashCreation.slice(-10)}
            </span>
          </div>
          {spesa.executed && (
            <div className="flex items-center gap-2 text-xs text-green-700 font-medium">
              <Icon icon="mdi:check-circle" className="text-lg" /> Eseguita il{" "}
              {spesa.executionDate
                ? new Date(
                    new Date(spesa.executionDate).getTime() + 60 * 60 * 1000
                  ).toLocaleString("it-IT", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                : ""}{" "}
              (
              <span
                className="cursor-pointer italic underline"
                onClick={() => {
                  navigator.clipboard.writeText(spesa.hashTransaction!);
                  alert("Hash transazione copiato! " + spesa.hashTransaction);
                }}
              >
                {spesa.hashTransaction?.slice(0, 10)}...
                {spesa.hashTransaction?.slice(-10)}
              </span>
              )
            </div>
          )}
          {spesa.proof && (
            <div className="mt-6 space-y-2">
          <h4 className="text-sm font-bold text-[#0F172A] mb-2">
            Prova di spesa
          </h4>
              <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                <Icon icon="mdi:paperclip" className="text-lg" /> Prova di spesa{" "}
                <a
                  href={import.meta.env.VITE_BACKEND_URL + "/" + spesa.proof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer hover:underline text-sm text-[#0F172A] underline decoration-slate-300"
                >
                  {spesa.proof?.split("/").pop()?.split("-").slice(1).join("-")}
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                <Icon icon="mingcute:link-fill" className="text-lg" />{" "}
               Hash prova{" "}
                <span
                  className="cursor-pointer italic underline"
                  onClick={() => {
                    navigator.clipboard.writeText(spesa.proofHash!);
                    alert("Hash copiato negli appunti!" + spesa.proofHash);
                  }}
                >
                  {spesa.proofHash!.slice(0, 10)}...
                  {spesa.proofHash!.slice(-10)}
                </span>
              </div>
            </div>
          )}
          {spesa.myVote && (
            <div className="mb-6 mt-6 space-y-2">
              <h4 className="text-sm font-bold text-[#0F172A] mb-2">
                Il mio voto
              </h4>
              <div className="flex items-center gap-2 text-xs text-blue-700 font-medium">
                <Icon icon="mdi:account-check-outline" className="text-lg" />{" "}
                Hai votato il:{" "}
                {new Date(
                  new Date(spesa.myVote.timestamp).getTime() + 60 * 60 * 1000
                ).toLocaleString("it-IT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </div>
              {spesa.myVote.motivation !== "" && (
                <div className="flex text-blue-700 items-center gap-2 text-xs font-medium">
                  <Icon icon="mdi:thumb-down" className="text-lg" /> Motivo:{" "}
                  {spesa.myVote.motivation}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-blue-700 font-medium">
                <Icon icon="mingcute:link-fill" className="text-lg" />{" "}
                Transazione di voto{" "}
                <span
                  className="cursor-pointer italic underline"
                  onClick={() => {
                    navigator.clipboard.writeText(spesa.myVote!.hashVote!);
                    alert(
                      "Hash transazione copiato! " + spesa.myVote!.hashVote
                    );
                  }}
                >
                  {spesa.myVote?.hashVote?.slice(0, 10)}...
                  {spesa.myVote?.hashVote?.slice(-10)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Sezione gestione solo se mode === 'manage' */}
        {mode === "manage" && (
          <>
            {/* Se hai già votato mostra il risultato */}
            {spesa.myVote !== null ? (
              <div className="w-full animate-fade-in">
                {spesa.myVote.vote === "for" ? (
                  <button
                    className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 mb-3 bg-secondary"
                    disabled
                  >
                    <Icon icon="mdi:thumb-up" className="text-lg" /> Hai
                    approvato la spesa
                  </button>
                ) : (
                  <button
                    className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 mb-3 bg-secondary"
                    disabled
                  >
                    <Icon icon="mdi:thumb-down" className="text-lg" /> Hai
                    negato la spesa
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Se non hai votato mostra i bottoni direttamente */}
                {!negata && (
                  <>
                    <p className="text-sm font-bold text-secondary mb-3 justify-center">
                      Valuta se è una spesa coerente
                    </p>
                    <div className="flex gap-4 w-full">
                      <button
                        onClick={() => vote("for")}
                        disabled={isPending}
                        className="flex-1 py-4 rounded-xl cursor-pointer flex items-center justify-center text-white font-bold text-sm shadow-lg transition-all active:scale-95 bg-primary hover:opacity-90 disabled:opacity-50"
                      >
                        {isPending ? (
                          <Icon
                            icon="mdi:loading"
                            className="text-lg animate-spin pr-4"
                          />
                        ) : (
                          ""
                        )}
                        {isPending ? statusText : "Approva"}
                      </button>
                      {!isPending && (
                        <button
                          onClick={() => setNegata(true)}
                          className="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-transform active:scale-95 bg-[#C21C1C] hover:bg-[#a61717]"
                        >
                          Nega
                        </button>
                      )}
                    </div>
                  </>
                )}
                {/* Se hai cliccato Nega, mostra la select motivazione */}
                {negata && (
                  <div className="w-full animate-fade-in mt-4">
                    <p className="text-sm font-bold text-secondary mb-3 justify-center text-center">
                      Spiega il motivo del rifiuto
                    </p>
                    <div className="relative mb-6">
                      <select
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-slate-300"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      >
                        <option value="">Seleziona una motivazione...</option>
                        <option value="costo">Costo troppo elevato</option>
                        <option value="non_pertinente">
                          Spesa non pertinente
                        </option>
                        <option value="documentazione">
                          Documentazione incompleta
                        </option>
                        <option value="altro">Altro</option>
                      </select>
                      <Icon
                        icon="mdi:chevron-down"
                        className="absolute right-3 top-3.5 text-slate-400"
                      />
                    </div>
                    <button
                      onClick={() => vote("against", rejectReason)}
                      disabled={rejectReason === "" || isPending}
                      className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 mb-3 bg-[#C21C1C] hover:bg-[#a61717] transition-opacity disabled:opacity-50 active:scale-95"
                    >
                      {isPending ? (
                        <>
                          <Icon
                            icon="mdi:loading"
                            className="text-lg animate-spin"
                          />{" "}
                          {statusText}
                        </>
                      ) : (
                        <>
                          <Icon icon="mdi:thumb-down" className="text-lg" />{" "}
                          Nega
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
        {mode === "view" && spesa.status === "approvata" && !spesa.executed && (
          <div className="w-full animate-fade-in">
            <button
              className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg flex items-center disabled:cursor-not-allowed disabled:opacity-50 justify-center gap-2 mb-3 bg-primary"
              disabled={isPending}
              onClick={executeSpesa}
            >
              {isPending ? (
                <>
                  <Icon icon="mdi:loading" className="animate-spin text-2xl" />{" "}
                  {statusText}
                </>
              ) : (
                <>
                  <Icon icon="bx:transfer" className="text-lg" /> Avvia
                  trasferimento fondi
                </>
              )}
            </button>
          </div>
        )}
        {mode === "view" &&
          spesa.status === "approvata" &&
          spesa.executed &&
          !spesa.proofHash && (
            <div className="w-full animate-fade-in">
              <div>
                <div className="flex items-center text-[#0F172A] font-bold text-sm mb-1 gap-1">
                  <Icon icon="mdi:paperclip" /> Allega prova di spesa
                </div>
                <input
                  type="file"
                  accept={allowedTypes.join(",")}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-12 rounded-xl border bg-white flex items-center px-4 text-sm cursor-pointer hover:bg-gray-50 transition-colors border-slate-300 text-slate-400`}
                >
                  {fileProof ? (
                    <span className="text-[#0F172A] font-medium truncate">
                      {fileProof.name}
                    </span>
                  ) : (
                    "Seleziona file..."
                  )}
                </div>
              </div>
              <button
                className="w-full py-3 mt-3 rounded-xl text-white font-bold text-sm shadow-lg flex items-center disabled:cursor-not-allowed disabled:opacity-50 justify-center gap-2 mb-3 bg-primary"
                disabled={isPending || fileProof === null}
                onClick={validateSpesa}
              >
                {isPending ? (
                  <>
                    <Icon
                      icon="mdi:loading"
                      className="animate-spin text-2xl"
                    />{" "}
                    {statusText}
                  </>
                ) : (
                  <>
                    <Icon icon="material-symbols:upload" className="text-lg" />{" "}
                    Carica prova di spesa
                  </>
                )}
              </button>
            </div>
          )}
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
}
