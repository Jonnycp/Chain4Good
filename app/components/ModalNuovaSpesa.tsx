import { useState, useRef } from "react";
import { Icon } from "@iconify/react";

import { useWriteContract, useConfig } from "wagmi";
import { parseUnits, parseEventLogs } from "viem";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useSubmit } from "react-router-dom";
import vaultAbi from "@abi/ProjectVault.sol/ProjectVault.json";
import { useQueryClient } from "@tanstack/react-query";

export default function ModalNuovaSpesa({
  projectId,
  currency,
  usoFondi,
  currentAmount,
  totSpeso,
  vaultAddress,
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (nuovaSpesa: any) => void;
  projectId: string;
  currency: string;
  usoFondi: string[];
  currentAmount: number;
  totSpeso: number;
  vaultAddress: string;
}) {
  const [isPending, setIsPending] = useState(false);
  const [statusText, setStatusText] = useState("");
  const submit = useSubmit();
  const queryClient = useQueryClient();
  const config = useConfig();
  const writeContract = useWriteContract();

  const [formData, setFormData] = useState({
    nome: "",
    importo: "",
    category: usoFondi[0] || "",
    descrizione: "",
    file: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    validate(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({ ...prev, file: "Il file deve essere un PDF." }));
        return;
      }
      setFormData((prev) => ({ ...prev, file: file }));
      setErrors((prev) => ({ ...prev, file: "" }));
      validate(false);
    }
  };

  const validate = (full = false) => {
    const newErrors: Record<string, string> = {};

    // Nome
    if (full || formData.nome) {
      if (!formData.nome) {
        newErrors.nome = "Il nome è obbligatorio.";
      } else if (formData.nome.length < 3) {
        newErrors.nome = "Minimo 3 caratteri.";
      } else if (!/^[A-Z]/.test(formData.nome)) {
        newErrors.nome = "Deve iniziare con una maiuscola.";
      }
    }

    // Importo
    if (full || formData.importo) {
      try {
        const importoNum = parseFloat(formData.importo);
        if (!formData.importo || isNaN(importoNum) || importoNum <= 0) {
          newErrors.importo = "Inserisci un importo valido > 0.";
        } else if (
          formData.importo &&
          !/^\d+(\.\d{1,2})?$/.test(formData.importo)
        ) {
          newErrors.importo = "Massimo due decimali.";
        } else if (importoNum > currentAmount - totSpeso) {
          newErrors.importo = "L'importo supera i fondi disponibili.";
        }
      } catch {
        newErrors.importo = "Inserisci un importo valido > 0.";
      }
    }

    // Categoria
    if (full || formData.category) {
      if (!formData.category) {
        newErrors.category = "Seleziona una categoria.";
      } else if (usoFondi.indexOf(formData.category) === -1) {
        newErrors.category = "Categoria non valida.";
      }
    }

    // Descrizione
    if (full || formData.descrizione) {
      if (!formData.descrizione.trim()) {
        newErrors.descrizione = "La descrizione è obbligatoria.";
      }
    }

    // File
    if (full || formData.file) {
      if (!formData.file) {
        newErrors.file = "Allegare un preventivo PDF è obbligatorio.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate(true)) {
      setIsPending(true);
      try {
        setStatusText("Eseguendo transazione...");
        const amountUnits = parseUnits(formData.importo, 18);

        //? 1. CHIAMATA BLOCKCHAIN
        const hash = await writeContract.mutateAsync({
          address: vaultAddress as `0x${string}`,
          abi: vaultAbi.abi,
          functionName: "createRequest",
          args: [amountUnits],
        });

        setStatusText("Attendo conferma transazione...");
        const receipt = await waitForTransactionReceipt(config, { hash });

        //? 2. ESTRAZIONE ID DAL LOG
        const logs = parseEventLogs({
          abi: vaultAbi.abi,
          eventName: "RequestCreated",
          logs: receipt.logs,
        });

        let requestIdOnChain = "";
        if (logs.length > 0 && "args" in logs[0]) {
          requestIdOnChain = (logs[0].args as any).requestId.toString();
        } else {
          throw new Error(
            "Impossibile ottenere l'ID della richiesta dalla transazione"
          );
        }
        //? 3. INVIO AL BACKEND
        setStatusText("Salvataggio...");
        const submissionData = new FormData();
        submissionData.append("title", formData.nome);
        submissionData.append("category", formData.category); // o da formData
        submissionData.append("amount", formData.importo);
        submissionData.append("description", formData.descrizione);
        submissionData.append("hashCreation", hash);
        submissionData.append("requestId", requestIdOnChain);
        if (formData.file) submissionData.append("preventivo", formData.file);

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/spese/new`,
          {
            method: "POST",
            body: submissionData,
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.error("Errore nel salvataggio della spesa.");
          setStatusText("Errore nel salvataggio della spesa.");
          return;
        }

        queryClient.invalidateQueries({
          queryKey: ["project-spese", projectId],
        });
        setIsPending(false);
        setStatusText("Donazione completata!");
        onSuccess(data.spesa);
        onClose();
      } catch (err) {
        console.error(err);
        setErrors({ file: "Errore durante la creazione della spesa." });
        setIsPending(false);
      }
    }
  };

  const isDisabledRequest =
    isPending ||
    !formData.nome ||
    !formData.importo ||
    !formData.descrizione ||
    !formData.file ||
    !formData.category ||
    parseFloat(formData.importo) <= 0 ||
    parseFloat(formData.importo) > currentAmount - totSpeso;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-appearance-in">
      <div className="bg-white rounded-[32px] w-full max-w-md p-6 relative shadow-2xl max-h-[95vh] overflow-y-auto no-scrollbar">
        <h2 className="text-xl font-bold text-[#0F172A] text-center mb-6">
          Nuova spesa
        </h2>

        <div className="space-y-5">
          {/* Nome Spesa */}
          <div>
            <div className="flex items-center text-[#0F172A] font-bold text-sm mb-1 gap-1">
              <Icon icon="mdi:cart-outline" /> Nome spesa
            </div>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`w-full h-12 rounded-xl border px-4 focus:ring-1 focus:ring-[#0F172A] outline-none transition-colors ${errors.nome ? "border-red-500 bg-red-50" : "border-slate-300"}`}
            />
            {errors.nome && (
              <p className="text-red-500 text-xs mt-1">{errors.nome}</p>
            )}
          </div>

          {/* Importo */}
          <div>
            <div
              className={`border rounded-xl p-4 flex items-center justify-between ${errors.importo ? "border-red-500 bg-red-50" : "border-slate-300"}`}
            >
              <Icon
                icon="mdi:currency-eur"
                className="text-3xl text-[#0F172A]"
              />
              <input
                type="number"
                name="importo"
                value={formData.importo}
                onChange={handleChange}
                placeholder="0,00"
                className="text-right text-4xl font-extrabold text-[#0F172A] w-full outline-none bg-transparent placeholder:text-slate-300"
              />
            </div>
            {errors.importo && (
              <p className="text-red-500 text-xs mt-1">{errors.importo}</p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-[#A6CF98] rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
            <div className="z-10 relative">
              <p className="text-xs font-bold text-[#1E293B]">
                La tua spesa verrà valutata
              </p>
              <p className="text-[10px] text-[#1E293B] leading-tight mt-0.5">
                Prima di sbloccare i fondi,
                <br />
                dovrà essere approvata dai donatori
              </p>
            </div>
            <Icon
              icon="mdi:medal"
              className="text-[#1E293B] opacity-80 text-4xl z-10"
            />
          </div>
          {/* Categoria Spesa */}
          <div>
            <div className="flex items-center text-[#0F172A] font-bold text-sm mb-1 gap-1">
              <Icon icon="mdi:tag-outline" /> Categoria spesa
            </div>
            <select
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              className={`w-full h-12 rounded-xl border px-4 focus:ring-1 focus:ring-[#0F172A] outline-none transition-colors ${errors.category ? "border-red-500 bg-red-50" : "border-slate-300"}`}
            >
              {usoFondi.map((uso) => (
                <option key={uso} value={uso}>
                  {uso}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>
          {/* Descrizione */}
          <div>
            <div className="flex items-center text-[#0F172A] font-bold text-sm mb-1 gap-1">
              <Icon icon="mdi:message-text-outline" /> Descrizione spesa
            </div>
            <textarea
              name="descrizione"
              rows={3}
              value={formData.descrizione}
              onChange={handleChange}
              className={`w-full rounded-xl border p-3 focus:ring-1 focus:ring-[#0F172A] outline-none resize-none transition-colors ${errors.descrizione ? "border-red-500 bg-red-50" : "border-slate-300"}`}
            />
            {errors.descrizione && (
              <p className="text-red-500 text-xs mt-1">{errors.descrizione}</p>
            )}
          </div>

          {/* File PDF */}
          <div>
            <div className="flex items-center text-[#0F172A] font-bold text-sm mb-1 gap-1">
              <Icon icon="mdi:paperclip" /> Allega preventivo
            </div>
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-12 rounded-xl border bg-white flex items-center px-4 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${errors.file ? "border-red-500 text-red-500" : "border-slate-300 text-slate-400"}`}
            >
              {formData.file ? (
                <span className="text-[#0F172A] font-medium truncate">
                  {formData.file.name}
                </span>
              ) : (
                "Seleziona file PDF..."
              )}
            </div>
            {errors.file && (
              <p className="text-red-500 text-xs mt-1">{errors.file}</p>
            )}
          </div>

          {/* Azioni */}
          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={handleSubmit}
              disabled={isDisabledRequest}
              className={`w-full h-14 font-bold text-lg rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                !isDisabledRequest
                  ? "bg-[#56A836] hover:bg-green-700 text-white cursor-pointer"
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
              ) : parseFloat(formData.importo) > currentAmount - totSpeso ? (
                <>
                  <Icon
                    icon="material-symbols:wallet"
                    className="text-slate-400"
                  />
                  Fondi insufficienti
                </>
              ) : (
                <>
                  Invia richiesta{" "}
                  <Icon icon="mdi:send" className="text-white" />
                </>
              )}
            </button>
            {!isPending && (
              <button
                onClick={onClose}
                className="text-sm font-bold text-slate-400 hover:text-slate-600"
              >
                Annulla
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
