import React from "react";
import { Icon } from "@iconify/react";
import type { AppContextType } from "~/context/AppProvider";
import { useNavigate } from "react-router";
import { DonorsAvatars, getTimeLeftLabel } from "./CardHome";

export function CardProgettoSupportatoSkeleton() {
  return (
    <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden animate-pulse">
      {/* Header Card */}
      <div className="relative h-40 w-full">
        <div className="w-full h-full bg-gray-200" />
        {/* Badge Location */}
        <div className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
          <div className="w-3.5 h-3.5 bg-gray-200 rounded-full" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
        {/* Logo Ente */}
        <div className="absolute -bottom-6 left-6 z-10">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-blue-900 p-[3px]">
            <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
              <div className="w-full h-full bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Body Card */}
      <div className="pt-10 px-6 pb-6">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div className="bg-gray-300 h-full rounded-full w-1/2" />
          </div>
          <div className="h-4 w-10 bg-gray-200 rounded" />
        </div>
        {/* Lista Transazioni Skeleton */}
        <div className="space-y-5 mb-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-start border-b border-slate-50 last:border-0 pb-3 last:pb-0"
            >
              <div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-20 bg-gray-100 rounded" />
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
        {/* Footer Card */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-5 h-5 bg-gray-200 rounded-full opacity-80" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
          <div className="flex -space-x-2 items-center">
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

export default function CardProgettoSupportato({
  _id,
  titolo,
  cover,
  luogo,
  endDate,
  ente,
  targetAmount,
  currentAmount,
  lastDonors,
  donations,
  numeroDonatori,
}: AppContextType["statsDonations"]["progettiSupportati"][0]) {
  const navigate = useNavigate();

  const handleCopyHash = (e: React.MouseEvent, hash: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    alert(`Hash copiato!`);
  };

  const openMap = (e: React.MouseEvent, location: string) => {
    e.stopPropagation();
    const encoded = encodeURIComponent(location);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encoded}`,
      "_blank"
    );
  };

  return (
    <div
      onClick={() => navigate("/progetto/" + _id)}
      className="bg-white rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
    >
      {/* Header Card */}
      <div className="relative h-40 w-full">
        <img src={
              cover.startsWith("https://")
                ? cover
                : `${import.meta.env.VITE_BACKEND_URL}/${cover}`
            } alt={titolo} className="w-full h-full object-cover" />

        {/* Badge Location */}
        <button
          onClick={(e) => openMap(e, luogo)}
          className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md hover:bg-gray-50 transition"
        >
          <Icon
            icon="solar:map-point-bold"
            className="text-secondary w-3.5 h-3.5"
          />
          <span className="text-xs font-bold text-secondary">{luogo}</span>
        </button>

        {/* Logo Ente */}
        <div
          onClick={() => navigate("/ente/" + ente.id)}
          className="absolute -bottom-6 left-6 z-10 hover:scale-105 transition-transform"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-blue-900 p-[3px]">
            <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
              <img
                src={ente.profilePicture}
                alt={ente.nome}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Body Card */}
      <div className="pt-10 px-6 pb-6">
        <h3 className="text-lg font-extrabold text-secondary leading-tight mb-4">
          {titolo}
        </h3>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full"
              style={{
                width: `${Math.round((currentAmount / targetAmount) * 100)}%`,
              }}
            ></div>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {Math.round((currentAmount / targetAmount) * 100)}%
          </span>
        </div>

        {/* LISTA TRANSAZIONI */}
        <div className="space-y-5 mb-6">
          {donations.map((donation) => (
            <div
              key={donation.id}
              className="flex justify-between items-start border-b border-slate-50 last:border-0 pb-3 last:pb-0"
            >
              <div>
                <p className="text-sm text-secondary">
                  Hai donato{" "}
                  <span className="font-extrabold">{donation.amount}</span>{" "}
                  <span className="font-bold text-xs">{donation.currency}</span>
                </p>
                {new Date(donation.date).toLocaleDateString("it-IT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              {/* Pulsante Copia Hash */}
              <button
                onClick={(e) => handleCopyHash(e, donation.hash)}
                className="text-secondary hover:text-primary p-1 rounded-full hover:bg-slate-50 transition active:scale-90"
                title="Copia Hash Transazione"
              >
                <Icon
                  icon="mdi:link-variant"
                  className="text-xl rotate-[-45deg]"
                />
              </button>
            </div>
          ))}
        </div>

        {/* Footer Card */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-500">
            <Icon
              icon="solar:clock-circle-bold"
              className="w-5 h-5 opacity-80"
            />
            <span className="text-xs font-medium">
              {getTimeLeftLabel(endDate)}
            </span>
          </div>

          <DonorsAvatars
            donors={lastDonors}
            total={numeroDonatori}
          />
        </div>
      </div>
    </div>
  );
}
