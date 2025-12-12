import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';

import logoLibersare from '~/assets/libersare.png';
import coverImage from '~/assets/casa.png'; 
import avatarPlaceholder from '~/assets/libersare.png'; 

export default function ProgettoSingoloUtente() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [isLiked, setIsLiked] = useState(false);

  const projectInfo = {
    title: "Rescue Animals’ Second Change Santuario",
    location: "Bari",
    raccolto: 157.00,
    target: 250.00,
    giorniMancanti: 14,
    donatoriCount: 124,
    descrizione: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    usoFondi: ["Lorem", "Ipsum", "Simply", "Dummy", "Text"]
  };

  const donatori = [
    { id: 1, name: "Bayy", amount: "25.34", currency: "ETH", time: "12 min fa", msg: "Hope help", avatar: avatarPlaceholder },
    { id: 2, name: "Rose", amount: "5.52", currency: "ETH", time: "1 ora fa", msg: "Blockchain", avatar: avatarPlaceholder },
    { id: 3, name: "John", amount: "3.75", currency: "ETH", time: "3 ore fa", msg: "Cryptocurrency", avatar: avatarPlaceholder },
    { id: 4, name: "Alice", amount: "2.10", currency: "ETH", time: "5 ore fa", msg: "Web3", avatar: avatarPlaceholder },
  ];

  const progressPercent = Math.min((projectInfo.raccolto / projectInfo.target) * 100, 100); //percentuale 

  const donorAvatars = [avatarPlaceholder, avatarPlaceholder, avatarPlaceholder, avatarPlaceholder];

  return (
    <div className="min-h-screen bg-white font-sans relative">

      {/* HEADER */}
      <div className="relative w-full h-[340px]">
        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent h-32 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 pt-10">
            <button onClick={() => navigate(-1)} className="text-white hover:opacity-80 transition drop-shadow-md">
                <Icon icon="mdi:arrow-left" width="28" />
            </button>
            <button className="text-white hover:opacity-80 transition drop-shadow-md">
                <Icon icon="humbleicons:share" width="26" />
            </button>
        </div>

        {/* Pulsante Cuore */}
        <button 
            onClick={() => setIsLiked(!isLiked)}
            className="absolute bottom-6 right-6 bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-20 hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 active:scale-95 group"
        >
            <Icon 
                icon={isLiked ? "mdi:heart" : "mdi:heart-outline"} 
                width="30" 
                className={`transition-colors duration-300 ${isLiked ? 'text-red-500' : 'text-slate-400 group-hover:text-red-400'}`}
            />
        </button>
      </div>

      {/* MAIN CONTENT */}
      <main className="relative z-10 -mt-8 bg-white rounded-t-[40px] px-6 pt-10 pb-32 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        
        <h1 className="text-[26px] font-extrabold text-secondary leading-tight mb-6">
            {projectInfo.title}
        </h1>

        {/* CARD FINANZIARIA */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm mb-8">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Raccolto</span>
                    <div className="text-2xl font-extrabold text-secondary">
                        {projectInfo.raccolto.toFixed(2)} <span className="text-xs font-bold text-slate-400">ETH</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Target</span>
                    <div className="text-xl font-bold text-slate-400">
                        {projectInfo.target.toFixed(2)} <span className="text-[10px] font-bold text-slate-400">ETH</span>
                    </div>
                </div>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-3 mb-5">
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <span className="text-xs font-bold text-slate-400">{Math.round(progressPercent)}%</span>
            </div>

            {/* Info Footer Card */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                    <Icon icon="mdi:clock-outline" className="text-lg" />
                    <span className="text-xs font-bold">{projectInfo.giorniMancanti} giorni mancanti</span>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {donorAvatars.map((av, idx) => (
                             <img key={idx} src={av} alt="d" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                        ))}
                    </div>
                    <span className="text-xs font-medium text-slate-500">{projectInfo.donatoriCount} donatori</span>
                </div>
            </div>
        </div>

        {/* LINK ENTE */}
        <div className="flex items-center justify-between mb-8 cursor-pointer group p-2 -mx-2 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => navigate(`/profilo-ente`)}>
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-blue-900 p-[2px]">
                    <img src={logoLibersare} alt="Ente" className="w-full h-full object-cover rounded-full border-2 border-white" />
                </div>
                <div>
                    <h3 className="text-base font-bold text-secondary">Libersare</h3>
                    <p className="text-xs text-slate-500 font-medium">Organizzazione di Volontariato</p>
                </div>
            </div>
            <Icon icon="mdi:chevron-right" className="text-slate-400 text-2xl" />
        </div>

        {/* SEZIONE INFORMAZIONI */}
        <div className="mb-8">
            <h2 className="text-lg font-extrabold text-secondary mb-3">Informazioni</h2>
            <p className="text-sm text-slate-500 leading-relaxed text-justify font-medium">
                {projectInfo.descrizione}
            </p>
        </div>

        {/* SEZIONE USO FONDI */}
        <div className="mb-8">
            <h3 className="text-base font-extrabold text-secondary mb-3">Come useremo i fondi?</h3>
            <ul className="space-y-2 pl-1">
                {projectInfo.usoFondi.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                        {item}
                    </li>
                ))}
            </ul>
        </div>

        {/* ULTIME DONAZIONI */}
        <div className="mb-12">
            <h2 className="text-lg font-extrabold text-secondary mb-4">Ultime donazioni</h2>
            <div className="flex flex-col gap-4">
                {donatori.map((donatore) => (
                    <div key={donatore.id} className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <img src={donatore.avatar} alt={donatore.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                            <div className="flex flex-col">
                                <p className="text-sm font-bold text-secondary">
                                    {donatore.name} <span className="font-normal text-slate-500">donated</span> {donatore.amount} <span className="text-xs font-bold text-slate-400">{donatore.currency}</span>
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">"{donatore.msg}"</p>
                            </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap mt-1">{donatore.time}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* FOOTER & SHARING */}
        <div className="border-t border-slate-100 pt-6 mb-4">
            <p className="text-center text-sm font-bold text-secondary mb-4">Aiuta questo progetto a crescere: Condividilo!</p>
            <div className="flex justify-center items-center gap-4 mb-8">
                 <button className="text-secondary hover:text-primary transition"><Icon icon="mdi:email-outline" width="24" /></button>
                 <button className="text-secondary hover:text-primary transition"><Icon icon="mdi:whatsapp" width="24" /></button>
                 <button className="text-secondary hover:text-primary transition"><Icon icon="mdi:instagram" width="24" /></button>
                 <button className="text-secondary hover:text-primary transition"><Icon icon="mdi:facebook" width="24" /></button>
                 <button className="text-secondary hover:text-primary transition"><Icon icon="mdi:linkedin" width="24" /></button>
                 <button className="text-secondary hover:text-primary transition"><Icon icon="mdi:link-variant" width="24" /></button>
            </div>

            <div className="text-center text-xs text-slate-400 mb-6">
                Pubblicato il 14/11/2025<br/>
                Qualcosa non va con questo progetto?<br/>
                <button className="underline decoration-slate-400 hover:text-secondary mt-1">Segnalalo a Chain4Good</button>
            </div>

            <div className="text-center text-[10px] text-slate-300">©2026 - Chain4Good</div>
        </div>

      </main>

      {/* DONA ORA */}
      <div className="fixed bottom-6 left-0 w-full px-6 z-50 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
            <button className="w-full bg-primary hover:bg-green-700 text-white font-bold text-lg py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.98]">
                Dona ora
            </button>
        </div>
      </div>

    </div>
  );
}