import { useState } from "react";
import { Icon } from "@iconify/react";
import type { Spesa } from "~/context/AppProvider";

interface ModalSpesaProps {
  spesa: Spesa | any;
  onClose: () => void;
  currency: string;
  mode: "view" | "manage";
}

export default function ModalGestioneSpesa({
  spesa,
  onClose,
  currency,
  mode,
}: ModalSpesaProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [negata, setNegata] = useState(false);

  const isApproved = spesa.stato === "approvata";
  const isRejected = spesa.stato === "rifiutata";
  const hasVoted = spesa.myVote !== null;

  const confirmApproveFinal = () => {
    // Logica per approvare la spesa
    alert("Spesa approvata!");
    onClose();
  };

  const confirmReject = () => {
    if (!rejectReason) {
      alert("Seleziona una motivazione per il rifiuto.");
      return;
    }
    // Logica per rifiutare la spesa con la motivazione
    alert(`Spesa rifiutata per: ${rejectReason}`);
    onClose();
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
            : isApproved
              ? "SPESA APPROVATA"
              : isRejected
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
          {spesa.preventivo.split("/").pop().split("-").slice(1).join("-")}
        </a>

        {/* Info */}
        <div className="mb-6 space-y-2">
          <h4 className="text-sm font-bold text-[#0F172A] mb-2">
            Informazioni
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Icon icon="mdi:clock-outline" /> Pubblicata il{" "}
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
                ? new Date(spesa.executionDate).toLocaleDateString()
                : ""}{" "}
              (
              <span
                className="cursor-pointer italic underline"
                onClick={() => {
                  navigator.clipboard.writeText(spesa.hashTransaction);
                  alert("Hash transazione copiato! " + spesa.hashTransaction);
                }}
              >
                {spesa.hashTransaction?.slice(0, 10)}...
                {spesa.hashTransaction?.slice(-10)}
              </span>
              )
            </div>
          )}
        </div>

        {/* Sezione gestione solo se mode === 'manage' */}
        {mode === "manage" && (
          <>
            {/* Se hai già votato mostra il risultato */}
            {hasVoted ? (
              <div className="w-full animate-fade-in">
                {spesa.myVote === "for" ? (
                  <button
                    className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 mb-3 bg-primary"
                    disabled
                  >
                    <Icon icon="mdi:thumb-up" className="text-lg" /> Hai
                    approvato la spesa
                  </button>
                ) : (
                  <button
                    className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 mb-3 bg-[#C21C1C]"
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
                    <><p className="text-sm font-bold text-secondary mb-3 justify-center">
                      Valuta se è una spesa coerente
                    </p>
                  <div className="flex gap-4 w-full">
                    <button
                      onClick={confirmApproveFinal}
                      className="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-transform active:scale-95 bg-primary hover:opacity-90"
                    >
                      Approva
                    </button>
                    <button
                      onClick={() => setNegata(true)}
                      className="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-transform active:scale-95 bg-[#C21C1C] hover:bg-[#a61717]"
                    >
                      Nega
                    </button>
                  </div></>
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
                      onClick={confirmReject}
                      className="flex-1 py-3 w-full rounded-xl text-white font-bold text-sm shadow-lg transition-transform active:scale-95 bg-[#C21C1C] hover:bg-[#a61717]"
                    >
                      Nega
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
}
