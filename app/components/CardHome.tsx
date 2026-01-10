import { Link } from "react-router";
import { Icon } from "@iconify/react";
import type { Project } from "../context/AppProvider";

export function DonorsAvatars({
  donors,
  total,
  textClass = "pl-3 self-center font-bold",
}: {
  donors: Project["lastDonors"];
  total: number;
  textClass?: string;
}) {
  return (
    <div className="flex -space-x-2 items-center">
      {donors.length > 0 &&
        donors.map((donor) => (
          <img
            key={donor.id}
            className="w-6 h-6 rounded-full border border-white"
            src={donor.profilePicture}
            alt={"Donatore " + donor.id}
          />
        ))}
      <span className={"text-[10px] text-gray-500 " + textClass}>
        {total > 0 ? "+" + total : "Dona ora"}
      </span>
    </div>
  );
}

export function CardHomeSkeleton() {
  return (
    <div className="relative w-full max-w-sm bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden animate-pulse">
      {/* HEADER IMMAGINE */}
      <div className="relative h-48 w-full bg-gray-200" />
      {/* BODY */}
      <div className="px-6 pt-10 pb-6">
        {/* Titolo */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
        {/* Barra di Progresso */}
        <div className="flex items-center gap-3 mb-1">
          <div className="w-full bg-gray-200 rounded-full h-3" />
          <div className="h-4 w-8 bg-gray-200 rounded" />
        </div>
        {/* Cifra */}
        <div className="h-7 bg-gray-200 rounded w-1/2 mb-4" />
        {/* Footer */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-white bg-gray-200"
              />
            ))}
            <div className="h-4 w-8 bg-gray-200 rounded ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const getTimeLeftLabel = (endDate: string) => {
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Fine raccolta fondi";
  if (diffDays === 1) return "1 giorno mancante";
  if (diffDays < 15) return `${diffDays} giorni mancanti`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} settimane mancanti`;
  if (diffDays > 30) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? "1 mese mancante" : `${months} mesi mancanti`;
  }
  return `${Math.floor(diffDays / 365)} anni mancanti`;
};

const CardHome = ({
  _id,
  ente,
  titolo,
  cover,
  stato,
  luogo,
  endDate,
  targetAmount,
  currentAmount,
  currency,
  numeroDonatori,
  lastDonors,
  numeroSpese,
  totaleSpeso,
  isMyProject = false,
  viewBadge = false,
}: Project & { isMyProject?: boolean, viewBadge?: boolean }) => {
  // LOGICA BADGE STATO
  const getBadgeConfig = () => {
    switch (stato) {
      case "attivo":
        return {
          label: "Attivo",
          className: "bg-[#67AA28] text-white",
        };
      case "completato":
        return {
          label: "Completato",
          className: "bg-slate-400 text-white",
        };
      case "raccolta":
      default:
        return {
          label: "Raccolta fondi",
          className: "bg-[#EBD44F] text-[#1E293B]",
        };
    }
  };

  const formattedAmount = new Intl.NumberFormat("it-IT").format(currentAmount);
  const progressPercentage =
    targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;

  return (
    <div className="relative w-full max-w-sm bg-white rounded-[32px] shadow-lg border border-gray-100 transition-transform hover:-translate-y-1 duration-300 cursor-pointer group overflow-hidden">
      {/* HEADER IMMAGINE */}
      <div className="relative h-48 w-full">
        <Link to={"/progetto/" + _id}>
          <img
            src={
              cover.startsWith("https://")
                ? cover
                : `${import.meta.env.VITE_BACKEND_URL}/${cover}`
            }
            alt={titolo}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* BADGE STATO DINAMICO */}
        {(isMyProject || viewBadge) && (
          <div
            className={`absolute top-0 right-0 px-6 py-2 rounded-bl-[24px] font-bold text-sm shadow-sm z-10 ${getBadgeConfig().className}`}
          >
            {getBadgeConfig().label}
          </div>
        )}
        {/* BADGE LUOGO */}
        <Link
          to={"/explore?near=" + luogo}
          className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 shadow-sm z-10 hover:bg-blue-50"
        >
          <Icon
            icon="solar:map-point-bold"
            className="text-gray-800 w-3.5 h-3.5"
          />
          <span className="text-xs font-bold text-gray-800">{luogo}</span>
        </Link>
        <Link
          to={"/ente/" + ente.id}
          className="absolute -bottom-8 left-6 z-20 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          title={`Vai al profilo di ${ente.nome}`}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-green-400 to-blue-600 p-[3px]">
            <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
              <img
                src={ente.profilePicture}
                alt={ente.nome}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </Link>
      </div>

      {/* BODY */}
      <div className="px-6 pt-10 pb-6">
        <Link to={"/progetto/" + _id}>
          {/* Titolo */}
          <h3 className="text-lg font-extrabold text-[#1E293B] leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
            {titolo}
          </h3>

          {/* CONTENUTO CONDIZIONALE */}
          {stato === "raccolta" ? (
            /* VISTA RACCOLTA FONDI */
            <>
              {/* Barra di Progresso */}
              <div className="flex items-center gap-3 mb-1">
                <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <div
                    className="bg-[#56A836] h-full rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-gray-500">
                  {Math.round(progressPercentage)}%
                </span>
              </div>

              {/* Cifra */}
              <div className="text-xl font-bold text-gray-800 mb-4">
                {formattedAmount}{" "}
                <span className="text-sm text-gray-500 font-normal">
                  {currency}
                </span>
              </div>

              {/* Footer Raccolta */}
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon
                    icon="solar:clock-circle-bold"
                    className="w-5 h-5 opacity-80"
                  />
                  <span className="text-xs font-medium">
                    {getTimeLeftLabel(endDate)}
                  </span>
                </div>
                <DonorsAvatars donors={lastDonors} total={numeroDonatori} />
              </div>
            </>
          ) : (
            /* VISTA PROGETTO ATTIVO / TERMINATO */
            <>
              {/* Statistiche Spesa */}
              <div className="space-y-1 mb-4">
                <p className="text-[#1E293B] font-medium text-sm">
                  Raccolto{" "}
                  <span className="font-bold text-lg">
                    {formattedAmount}
                  </span>{" "}
                  <span className="text-xs text-gray-500">{currency}</span>
                </p>
                <p className="text-[#1E293B] font-medium text-sm">
                  Speso il{" "}
                  <span className="font-bold">
                    {Math.round(Math.min((totaleSpeso / currentAmount) * 100, 100))}%
                  </span>{" "}
                  del budget
                </p>
              </div>

              {/* Footer Attivo */}
              <div className="flex justify-between items-center mt-6">
                {/* Spese effettuate */}
                <div className="flex items-center gap-2 text-gray-500">
                  <Icon
                    icon="mdi:cart-outline"
                    className="w-5 h-5 text-[#1E293B]"
                  />
                  <span className="text-xs font-medium">
                    {`${numeroSpese} ${numeroSpese == 0 ? "spese" : numeroSpese == 1 ? "spesa":"spese"} effettuat${numeroSpese == 0 ? "e" : numeroSpese == 1 ? "a":"e"}`}
                  </span>
                </div>

                {/* Donatori */}
                <DonorsAvatars
                  donors={lastDonors}
                  total={numeroDonatori}
                  textClass="ml-1"
                />
              </div>
            </>
          )}
        </Link>
      </div>
    </div>
  );
};

export default CardHome;
