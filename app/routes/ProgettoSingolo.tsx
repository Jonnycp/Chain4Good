import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useRevalidator,
} from "react-router-dom";

// Componenti Condivisi
import HeaderCover from "~/components/HeaderCover";
import CardSpesa from "~/components/CardSpesa";
import ModalGestioneSpesa from "~/components/ModalGestioneSpesa";

// Modali specifici per Ente
import ModalNuovaSpesa from "~/components/ModalNuovaSpesa";
import ModalSuccessoSpesa from "~/components/ModalSuccessoSpesa";

// Modali specifici per Utente
import PopoverDona from "~/components/PopoverDona";
import ModalGrazie from "~/components/ModalGrazie";
import { API_BASE_URL, useApp } from "~/context/AppProvider";
import { DonorsAvatars, getTimeLeftLabel } from "~/components/CardHome";

// Web3
import { useWriteContract, useConfig, useReadContract } from "wagmi";
import { erc20Abi, parseUnits } from "viem";
import { waitForTransactionReceipt } from "@wagmi/core";

export type PROJECT_BIG = {
  _id: string;
  title: string;
  category: string;
  location: string;
  descrizione: string;
  usoFondi: string[];
  currency: string;
  ente: {
    _id: string;
    nome: string;
    profilePicture: string;
    denominazioneSociale: string;
  };
  coverImage: string;
  endDate: string;
  targetAmount: number;
  currentAmount: number;
  status: "raccolta" | "attivo" | "completato" | "annullato";
  isMy: boolean;
  vaultAddress: string;
  createdAt: string;
  updatedAt: string;
};

export async function loader({
  params,
  request,
}: {
  params: { id?: string };
  request: Request;
}) {
  const id = params.id?.trim();
  if (!id || id.length !== 24 || !/^[a-fA-F0-9]{24}$/.test(id)) {
    return redirect("/");
  }
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    credentials: "include",
    headers: {
      Cookie: request.headers.get("Cookie") || "",
    },
  });
  if (!res.ok) return redirect("/");
  const projectDetails = await res.json();
  if (!projectDetails) return redirect("/");
  return projectDetails;
}

export default function ProgettoSingolo() {
  const navigate = useNavigate();

  const project = useLoaderData() as PROJECT_BIG;
  if (!project) return null;

  const { projectDonations, projectSpese, setCurrentProjectId, contracts, user } = useApp();
  const progressPercent = Math.min(
    (project.currentAmount / project.targetAmount) * 100,
    100
  );
  const spesePercent = Math.min(
    (projectSpese.sommaSpese / project.currentAmount) * 100,
    100
  );
  const [shareUrl, setShareUrl] = useState<string>("");
  const revalidator = useRevalidator();

  const isExpired = new Date(project.endDate) < new Date();
  const isFull = project.currentAmount >= project.targetAmount;

  const { data: allowance } = useReadContract({
    address: contracts?.eurc as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args:
      user!.address && project.vaultAddress
        ? [
            user!.address as `0x${string}`,
            project.vaultAddress as `0x${string}`,
          ]
        : undefined,
    query: { enabled: !!user!.address && !!project.vaultAddress&& !!contracts?.eurc },
  });

  // Verifica se serve l'approvazione
  const needsApproval =
    allowance !== undefined
      ? allowance <
        parseUnits(
          (project.targetAmount - project.currentAmount).toString() || "0",
          18
        )
      : true;

  const [isApproved, setIsApproved] = useState(!needsApproval);
  const [isApproving, setIsApproving] = useState(false);
  const writeContract = useWriteContract();
  const config = useConfig();

  useEffect(() => {
    setCurrentProjectId(project._id);
    return () => setCurrentProjectId(null); // Pulizia quando si esce dalla pagina
  }, [project._id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const [activeTab, setActiveTab] = useState<
    "votazione" | "approvata" | "rifiutata"
  >("votazione");

  // Stati Modali
  const [isNewSpesaOpen, setIsNewSpesaOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [selectedSpesa, setSelectedSpesa] = useState<any>(null);
  const [isDonaOpen, setIsDonaOpen] = useState(false);
  const [isGrazieOpen, setIsGrazieOpen] = useState(false);
  const [donatedAmount, setDonatedAmount] = useState(0);

  // Approva uso currency
  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const maxAmount = parseUnits(project.targetAmount.toString(), 18);

      const hash = await writeContract.mutateAsync({
        address: contracts?.eurc as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [project.vaultAddress as `0x${string}`, maxAmount],
      });

      await waitForTransactionReceipt(config, { hash });
      setIsApproved(true);
    } catch (err) {
      console.error("Approvazione fallita", err);
    } finally {
      setIsApproving(false);
      setIsDonaOpen(true);
    }
  };

  //Creazione nuova spesa
  const handleNewSpesaSuccess = () => {
    setIsNewSpesaOpen(false);
    setIsSuccessOpen(true);
    setActiveTab("votazione");
  };

  // // Voto spesa
  // // LOGICA UTENTE: Voto spesa
  // const handleUpdateStatus = (
  //   id: number,
  //   decision: "attesa" | "approvata" | "rifiutata"
  // ) => {
  //   setListaSpese((prev) =>
  //     prev.map((item) => {
  //       if (item.id === id) {
  //         const updatedVotiPositivi =
  //           decision === "approvata"
  //             ? (item.votiPositivi || 0) + 1
  //             : item.votiPositivi;

  //         const updatedVotiNegativi =
  //           decision === "rifiutata"
  //             ? (item.votiNegativi || 0) + 1
  //             : item.votiNegativi;

  //         return {
  //           ...item,
  //           stato: item.stato,
  //           votiPositivi: updatedVotiPositivi,
  //           votiNegativi: updatedVotiNegativi,
  //         };
  //       }
  //       return item;
  //     })
  //   );

  //   // Chiudiamo il modale
  //   setSelectedSpesa(null);
  // };


  // Render dei modali
  const renderSelectedSpesaModal = () => {
    if (!selectedSpesa) return null;
    if (project.isMy || selectedSpesa.status !== "votazione" || selectedSpesa.myVote) {
      return (
        <ModalGestioneSpesa
          mode="view"
          spesa={selectedSpesa}
          currency={project.currency}
          onClose={() => setSelectedSpesa(null)}
        />
      );
    }
    // Gestione spesa per Utente
    if (selectedSpesa.status === "votazione") {
      return (
        <ModalGestioneSpesa
          mode="manage"
          spesa={selectedSpesa}
          currency={project.currency}
          onClose={() => setSelectedSpesa(null)}
        />
      );
    }
  };

  const filteredSpese = projectSpese.spese.filter((spesa) => spesa.status === activeTab);

  return (
    <div className="min-h-screen bg-white font-sans pb-10 relative">
      {/* MODALI */}

      {/* 1. Modale Dettaglio/Gestione (comune/switch) */}
      {renderSelectedSpesaModal()}

      {/* 2. Modali Ente (Nuova Spesa e Successo) - Renderizzati solo se Ente */}
      {project.isMy && isNewSpesaOpen && (projectSpese.spesaNonVerificata ? false : true) && (
        <ModalNuovaSpesa
          projectId={project._id}
          currency={project.currency}
          currentAmount={project.currentAmount}
          totSpeso={projectSpese.sommaSpese}
          usoFondi={project.usoFondi}
          vaultAddress={project.vaultAddress}
          onClose={() => {
            revalidator.revalidate();
            setIsNewSpesaOpen(false);
          }}
          onSuccess={handleNewSpesaSuccess}
        />
      )}
      {project.isMy && isSuccessOpen && (
        <ModalSuccessoSpesa onClose={() => setIsSuccessOpen(false)} />
      )}

      {/* 3. Modali Utente (Dona e Grazie) - Renderizzati solo se Utente */}
      {isDonaOpen && (
        <PopoverDona
          onClose={(amount) => {
            if(amount){
              revalidator.revalidate();
              setDonatedAmount(amount);
              setIsGrazieOpen(true);
            }
            setIsDonaOpen(false)
          }}
          currentAmount={project.currentAmount}
          targetAmount={project.targetAmount}
          currency={project.currency}
          vaultAddress={project.vaultAddress}
          projectId={project._id}
        />
      )}

      {isGrazieOpen && (
        <ModalGrazie
          amount={donatedAmount}
          projectName={project.title}
          enteName={project.ente.nome}
          currency={project.currency}
          onClose={() => setIsGrazieOpen(false)}
          onHistory={() => navigate("/donazioni-utente")}
        />
      )}

      {/* HEADER */}
      <HeaderCover
        type={project.isMy ? "ente" : "utente"}
        coverImage={
          project.coverImage.startsWith("https://")
            ? project.coverImage
            : `${import.meta.env.VITE_BACKEND_URL}/${project.coverImage}`
        }
        location={project.location}
      />

      {/* MAIN CONTENT */}
      <main className="relative z-10 -mt-8 bg-white rounded-t-[40px] px-6 pt-10 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <h1 className="text-[26px] font-extrabold text-secondary leading-tight mb-6">
          {project.title}
        </h1>

        {/* CARD FINANZIARIA */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm mb-8">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                {project.status === "raccolta" ? "RACCOLTO" : "SPESO"}
              </span>
              <div className="text-2xl font-extrabold text-secondary">
                {project.status === "raccolta"
                  ? project.currentAmount.toFixed(2)
                  : projectSpese.sommaSpese.toFixed(2)}
                <span className="text-xs font-bold text-slate-400">
                  {" "}
                  {project.currency}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                {project.status === "raccolta" ? "TARGET" : "RACCOLTO"}
              </span>
              <div className="text-xl font-bold text-slate-400">
                {project.status === "raccolta"
                  ? project.targetAmount.toFixed(2)
                  : project.currentAmount.toFixed(2)}
                <span className="text-[10px] font-bold text-slate-400">
                  {" "}
                  {project.currency}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${project.status === "raccolta" ? progressPercent : spesePercent}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {Math.round(project.status === "raccolta" ? progressPercent : spesePercent)}%
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-600">
              <Icon
                icon={
                  project.status === "raccolta"
                    ? "mdi:clock-outline"
                    : "mdi:cart-outline"
                }
                className="text-lg"
              />
              <span className="text-xs font-bold">
                {project.status === "raccolta"
                  ? getTimeLeftLabel(project.endDate)
                  : `${projectSpese.spese.length} spese effettuate`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DonorsAvatars
                donors={Array.from(
                  new Map(
                    projectDonations.donors.map((d: any) => [d.username, d])
                  ).values()
                )
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) 
                  .slice(0, 5)
                  .map((d: any) => ({
                    id: "mini-donation" + d.username,
                    profilePicture: d.profilePicture,
                  }))}
                total={projectDonations.totDonors}
                textClass="text-xs font-medium text-slate-500 pl-3 self-center font-bold"
              />
            </div>
          </div>
        </div>

        {/* INFO ENTE */}
        <div
          className="flex items-center gap-3 mb-8 cursor-pointer group"
          onClick={() => navigate(`/ente/${project.ente._id}`)}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-blue-900 p-[2px] group-hover:scale-105 transition-transform">
            <img
              src={project.ente.profilePicture}
              alt="Ente"
              className="w-full h-full object-cover rounded-full border-2 border-white"
            />
          </div>
          <div>
            <h3 className="text-base font-bold text-secondary group-hover:text-primary transition-colors">
              {project.ente.nome}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {project.ente.denominazioneSociale}
            </p>
          </div>
        </div>

        {/* SEZIONE SPESE */}
        {project.status == "attivo" && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-extrabold text-secondary">Spese</h2>

              {/* Visualizza bottone SOLO se Ente */}
              {project.isMy && (
                <button
                  onClick={() => setIsNewSpesaOpen(true)}
                  disabled={projectSpese.spesaNonVerificata ? true : false}
                  className="bg-primary hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1 shadow-md transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed"
                >
                  <Icon icon={projectSpese.spesaNonVerificata ? "material-symbols:lock" : "mdi:plus"} className="text-base" /> {projectSpese.spesaNonVerificata ? "Devi verificare la spesa" : "Nuova Spesa"}
                </button>
              )}
            </div>

            <div className="relative mb-5">
              <Icon
                icon="solar:magnifer-linear"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl"
              />
              <input
                type="text"
                placeholder="Cosa vuoi cercare?"
                className="w-full bg-[#F8FAFC] rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* TABS */}
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setActiveTab("votazione")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === "votazione" ? "bg-primary text-white shadow-md" : "bg-[#F1F5F9] text-slate-500 hover:bg-slate-200"}`}
              >
                {" "}
                <Icon icon="mdi:help-circle-outline" className="text-base" /> In
                attesa
              </button>
              <button
                onClick={() => setActiveTab("approvata")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === "approvata" ? "bg-secondary text-white shadow-md" : "bg-[#F1F5F9] text-slate-500 hover:bg-slate-200"}`}
              >
                {" "}
                <Icon icon="mdi:check" className="text-base" /> Approvate
              </button>
              <button
                onClick={() => setActiveTab("rifiutata")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === "rifiutata" ? "bg-[#D32F2F] text-white shadow-md" : "bg-[#F1F5F9] text-slate-500 hover:bg-slate-200"}`}
              >
                {" "}
                <Icon icon="mdi:close" className="text-base" /> Rifiutate
              </button>
            </div>

            {/* LISTA SPESE */}
            <div className="flex flex-col gap-4 min-h-[100px]">
              {filteredSpese.length > 0 ? (
                filteredSpese.map((spesa) => (
                  <CardSpesa
                    key={spesa._id}
                    {...spesa}
                    currency={project.currency}
                    isMy={project.isMy}
                    onClick={() => setSelectedSpesa(spesa)}
                  />
                ))
              ) : (
                <div className="px-6 py-12 text-center md:bg-white rounded-3xl border-secondary/20 border-2">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon
                    icon="solar:box-minimalistic-linear"
                    className="text-3xl text-slate-400"
                  />
                </div>
                <p className="text-slate-500 text-sm font-medium">
                  Nessuna spesa in questa categoria.
                </p>
              </div>
              )}
            </div>
          </div>
        )}

        {/* SEZIONE STORICO DONAZIONI */}
        <div className="mb-10">
          <h2 className="text-base font-extrabold text-secondary mb-3">
            Informazioni
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed text-justify mb-6 font-medium">
            {project.descrizione}
          </p>
          <h3 className="text-base font-extrabold text-secondary mb-3">
            Come useremo i fondi?
          </h3>
          <ul className="space-y-2">
            {project.usoFondi.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-sm text-slate-500 font-medium"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-12">
          <div
            className="flex justify-between items-center mb-6 cursor-pointer hover:opacity-70 transition"
            onClick={() => navigate("/project/" + project._id + "/donazioni")}
          >
            <h2 className="text-base font-extrabold text-secondary">
              Donazioni ricevute
            </h2>
            <Icon icon="mdi:arrow-right" className="text-secondary text-2xl" />
          </div>
          <div className="flex flex-col gap-1">
            {projectDonations.donors.length > 0 ? (
              projectDonations.donors.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 20).map((donatore, i) => (
                <div
                  key={donatore.id+"-"+i}
                  className="flex items-start justify-between py-3 border-b border-slate-50 last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={donatore.profilePicture}
                      alt={donatore.username}
                      className="w-10 h-10 rounded-full object-cover border border-slate-100"
                    />
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-secondary">
                        {donatore.username}{" "}
                        <span className="font-normal text-slate-500">
                          donated
                        </span>{" "}
                        {donatore.amount}
                        <span className="text-xs font-bold text-slate-400">
                          {" "}
                          {donatore.symbol}{" "}
                        </span>
                      </p>
                      <p className="text-xs text-slate-400 italic mt-1">
                        {donatore.messaggio && `"${donatore.messaggio}" - `}
                        <b
                          className="font-bold underline italic cursor-pointer"
                          onClick={(e) => {
                            navigator.clipboard.writeText(
                              donatore.hashTransaction
                            );
                            alert(`Hash copiato!`);
                          }}
                        >
                          {donatore.hashTransaction.slice(0, 6) +
                            "..." +
                            donatore.hashTransaction.slice(-4)}
                        </b>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap mt-1">
                    <button
                      onClick={(e) => {
                        navigator.clipboard.writeText(donatore.hashTransaction);
                        alert(`Hash copiato!`);
                      }}
                      className="text-white text-md hover:text-primary p-1 mr-5 bg-primary rounded-full hover:bg-secondary transition active:scale-90"
                      title="Copia Hash Transazione"
                    >
                      <Icon
                        icon="mdi:link-variant"
                        className="text-xl rotate-[-45deg]"
                      />
                    </button>
                    {new Date(donatore.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center md:bg-white rounded-3xl border-secondary/20 border-2">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon
                    icon="solar:box-minimalistic-linear"
                    className="text-3xl text-slate-400"
                  />
                </div>
                <p className="text-slate-500 text-sm font-medium">
                  Nessuna donazione registrata.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-100 pt-6 mb-4">
          <p className="text-center text-sm font-bold text-secondary mb-4">
            Aiuta questo progetto a crescere: Condividilo!
          </p>
          <div className="flex justify-center items-center gap-4 mb-8">
            {[
              {
                icon: "mdi:email-outline",
                url: null,
                label: "Condividi via Email",
                onClick: () => {
                  window.location.href = `mailto:?subject=Guarda questo progetto Chain4Good!&body=Scopri il progetto "${project.title}" su Chain4Good: ${shareUrl}`;
                },
              },
              {
                icon: "mdi:whatsapp",
                url: `https://wa.me/?text=Guarda%20questo%20progetto%20su%20Chain4Good:%20${encodeURIComponent(shareUrl)}`,
                label: "Condividi su WhatsApp",
                onClick: null,
              },
              {
                icon: "mdi:instagram",
                url: `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`,
                label: "Condividi su Instagram",
                onClick: null,
              },
              {
                icon: "mdi:facebook",
                url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                label: "Condividi su Facebook",
                onClick: null,
              },
              {
                icon: "mdi:linkedin",
                url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                label: "Condividi su LinkedIn",
                onClick: null,
              },
              {
                icon: "mdi:link-variant",
                url: null,
                label: "Copia link",
                onClick: async () => {
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: document.title,
                        text: `Guarda questo progetto su Chain4Good: ${project.title}`,
                        url: shareUrl,
                      });
                    } catch (err) {
                      // Utente ha annullato o errore
                    }
                  } else {
                    try {
                      await navigator.clipboard.writeText(shareUrl);
                      alert("Link copiato negli appunti!");
                    } catch {
                      alert("Copia fallita!");
                    }
                  }
                },
              },
            ].map((social, index) =>
              social.onClick ? (
                <button
                  key={social.icon}
                  className="text-secondary hover:text-primary transition"
                  onClick={social.onClick}
                  aria-label={social.label}
                  type="button"
                >
                  <Icon icon={social.icon} width="24" />
                </button>
              ) : (
                <a
                  key={social.icon}
                  className="text-secondary hover:text-primary transition"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <Icon icon={social.icon} width="24" />
                </a>
              )
            )}
          </div>
          <div className="text-center text-xs text-slate-400 mb-6">
            Pubblicato il {new Date(project.createdAt).toLocaleDateString()}
            <br />
            Qualcosa non va con questo progetto?
            <br />
            {project.vaultAddress && (
              <>
                Hash progetto:{" "}
                <b
                  className="underline italic cursor-pointer"
                  onClick={(e) => {
                    navigator.clipboard.writeText(project.vaultAddress);
                    alert(`Hash copiato!`);
                  }}
                >
                  {project.vaultAddress}
                </b>
                <br />
              </>
            )}
            <br />
            <button className="underline decoration-slate-400 hover:text-secondary mt-1">
              Segnalalo a Chain4Good
            </button>
          </div>
          <div className="text-center text-[10px] text-slate-300">
            ©{new Date().getFullYear()} - Chain4Good
          </div>
        </div>
      </main>
      {/* DONA ORA BUTTON */}
      {project.status === "raccolta" &&
        !project.isMy &&
        !isExpired &&
        !isFull && (
          <div className="fixed bottom-6 left-0 w-full px-6 z-50 pointer-events-none">
            <div className="max-w-md mx-auto pointer-events-auto">
              {!isApproved ? (
                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="w-full bg-secondary text-white font-bold text-lg py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isApproving ? (
                    <Icon
                      icon="mdi:loading"
                      className="animate-spin text-2xl"
                    />
                  ) : (
                    <Icon icon="mdi:lock-open-outline" className="text-2xl" />
                  )}
                  {isApproving
                    ? "Approvazione in corso..."
                    : `Abilita ${project.currency} per donare`}
                </button>
              ) : (
                <button
                  onClick={() => setIsDonaOpen(true)}
                  className="w-full bg-primary hover:bg-green-700 text-white font-bold text-lg py-4 rounded-2xl shadow-xl animate-appearance-in"
                >
                  Dona ora ❤️
                </button>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
