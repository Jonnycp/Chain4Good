//pagina per visualizzare il dettaglio di un progetto per un ente che gestisce le spese
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';

import HeaderCover from '~/components/HeaderCover';
import CardSpesa from '~/components/CardSpesa';
import ModalNuovaSpesa from '~/components/ModalNuovaSpesa';
import ModalDettagliSpesa from '~/components/ModalDettagliSpesa';
import ModalSuccessoSpesa from '~/components/ModalSuccessoSpesa';

import logoLibersare from '~/assets/libersare.png';
import coverImage from '~/assets/casa.png'; 
import avatarPlaceholder from '~/assets/libersare.png'; 

type StatoSpesa = 'attesa' | 'approvata' | 'rifiutata';

export default function ProgettoSingoloEnte() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [activeTab, setActiveTab] = useState<StatoSpesa>('attesa');
  const [isNewSpesaOpen, setIsNewSpesaOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [selectedSpesa, setSelectedSpesa] = useState<any>(null);

  const [listaSpese, setListaSpese] = useState([
    { 
      id: 1, 
      titolo: "Acquisto furgoncino fantastico (usato)", 
      importo: 1570, 
      valuta: "USDC", 
      giorni: 3, 
      stato: "attesa" as StatoSpesa,
      descrizione: "Furgone necessario per il trasporto degli animali.",
      fileName: "preventivo_furgone.pdf",
      dataPubblicazione: "10/12/2025",
      votiPositivi: 5,
      votiNegativi: 0
    },
    { 
      id: 2, 
      titolo: "Pagare social media manager", 
      importo: 70, 
      valuta: "USDC", 
      giorni: 13, 
      stato: "approvata" as StatoSpesa,
      descrizione: "Gestione campagne social.",
      fileName: "fattura_smm.pdf",
      dataPubblicazione: "01/12/2025",
      votiPositivi: 45,
      votiNegativi: 2
    },
    { 
      id: 3, 
      titolo: "Pranzo di capodanno", 
      importo: 100, 
      valuta: "USDC", 
      votes: 120, 
      stato: "rifiutata" as StatoSpesa,
      descrizione: "Festeggiamenti interni staff.",
      fileName: "scontrino.pdf",
      dataPubblicazione: "31/12/2025",
      votiPositivi: 2,
      votiNegativi: 120
    }
  ]);

  const projectInfo = {
    title: "Rescue Animals’ Second Change Santuario",
    location: "Bari",
    speso: 10.00,
    raccolto: 250.00,
    speseCount: listaSpese.length, 
    donatoriCount: 124,
    descrizione: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    usoFondi: ["Cibo e cure veterinarie", "Manutenzione strutture"]
  };

  const donatori = [
    { id: 1, name: "Bayy", amount: "25.34", currency: "ETH", time: "12 min fa", msg: "Hope help", avatar: avatarPlaceholder },
    { id: 2, name: "Rose", amount: "5.52", currency: "ETH", time: "1 ora fa", msg: "Blockchain", avatar: avatarPlaceholder },
  ];

  // LOGICA AGGIUNTA SPESA
  const handleNewSpesaSuccess = (nuovaSpesa: any) => {
    setListaSpese(prev => [nuovaSpesa, ...prev]); // Aggiunge in cima
    setIsNewSpesaOpen(false);
    setIsSuccessOpen(true);
    setActiveTab('attesa'); // Sposta il tab per vedere la nuova spesa
  };

  const filteredSpese = listaSpese.filter(spesa => spesa.stato === activeTab);
  const progressPercent = Math.min((projectInfo.speso / projectInfo.raccolto) * 100, 100);

  return (
    <div className="min-h-screen bg-white font-sans pb-10 relative">

      {/* MODALI */}
      {isNewSpesaOpen && (
        <ModalNuovaSpesa 
            onClose={() => setIsNewSpesaOpen(false)} 
            onSuccess={handleNewSpesaSuccess} 
        />
      )}
      {isSuccessOpen && (
        <ModalSuccessoSpesa onClose={() => setIsSuccessOpen(false)} />
      )}
      {selectedSpesa && (
        <ModalDettagliSpesa spesa={selectedSpesa} onClose={() => setSelectedSpesa(null)} />
      )}

        <HeaderCover
            type="ente"
            coverImage={coverImage}
            location={projectInfo.location}
        />

      {/* MAIN CONTENT */}
      <main className="relative z-10 -mt-8 bg-white rounded-t-[40px] px-6 pt-10 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        
        <h1 className="text-[26px] font-extrabold text-secondary leading-tight mb-6">{projectInfo.title}</h1>

        {/* CARD FINANZIARIA */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm mb-8">
            <div className="flex justify-between items-end mb-2">
                <div><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Speso</span><div className="text-xl font-bold text-secondary">{projectInfo.speso.toFixed(2)} <span className="text-[10px] font-bold text-slate-400">ETH</span></div></div>
                <div className="text-right"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Raccolto</span><div className="text-xl font-bold text-secondary">{projectInfo.raccolto.toFixed(2)} <span className="text-[10px] font-bold text-slate-400">ETH</span></div></div>
            </div>
            <div className="flex items-center gap-3 mb-4"><div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden"><div className="bg-primary h-full rounded-full" style={{ width: `${progressPercent}%` }}></div></div><span className="text-xs font-bold text-slate-400">{Math.round(progressPercent)}%</span></div>
            <div className="flex justify-between items-center text-slate-500 text-xs font-medium"><div className="flex items-center gap-2"><Icon icon="mdi:cart-outline" className="text-lg" />{listaSpese.length} spese effettuate</div><div className="flex items-center gap-2"><div className="flex -space-x-2"><div className="w-5 h-5 rounded-full bg-red-400 border-2 border-white"></div><div className="w-5 h-5 rounded-full bg-blue-400 border-2 border-white"></div></div>{projectInfo.donatoriCount} donatori</div></div>
        </div>

        {/* INFO ENTE */}
        <div className="flex items-center gap-3 mb-8 cursor-pointer group" onClick={() => navigate(`/profilo-ente`)}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-blue-900 p-[2px] group-hover:scale-105 transition-transform"><img src={logoLibersare} alt="Ente" className="w-full h-full object-cover rounded-full border-2 border-white" /></div>
            <div><h3 className="text-base font-bold text-secondary group-hover:text-primary transition-colors">Libersare</h3><p className="text-xs text-slate-500 font-medium">Organizzazione di Volontariato</p></div>
        </div>

        {/* SEZIONE SPESE */}
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-extrabold text-secondary">Spese</h2>
                <button onClick={() => setIsNewSpesaOpen(true)} className="bg-primary hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1 shadow-md transition-colors"><Icon icon="mdi:plus" className="text-base" /> Nuova spesa</button>
            </div>

            <div className="relative mb-5"><Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" /><input type="text" placeholder="Cosa vuoi cercare?" className="w-full bg-[#F8FAFC] rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" /></div>

            {/* TABS */}
             <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
                <button onClick={() => setActiveTab('attesa')} className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'attesa' ? 'bg-primary text-white shadow-md' : 'bg-[#F1F5F9] text-slate-500 hover:bg-slate-200'}`}> <Icon icon="mdi:help-circle-outline" className="text-base" /> In attesa</button>
                <button onClick={() => setActiveTab('approvata')} className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'approvata' ? 'bg-secondary text-white shadow-md' : 'bg-[#F1F5F9] text-slate-500 hover:bg-slate-200'}`}> <Icon icon="mdi:check" className="text-base" /> Approvate</button>
                <button onClick={() => setActiveTab('rifiutata')} className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'rifiutata' ? 'bg-secondary text-white shadow-md' : 'bg-[#F1F5F9] text-slate-500 hover:bg-slate-200'}`}> <Icon icon="mdi:close" className="text-base" /> Rifiutate</button>
            </div>

            {/* LISTA SPESE */}
            <div className="flex flex-col gap-4 min-h-[100px]">
                {filteredSpese.length > 0 ? (
                    filteredSpese.map((spesa) => (
                        <CardSpesa key={spesa.id} {...spesa} onClick={() => setSelectedSpesa(spesa)} />
                    ))
                ) : (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl"><p className="text-slate-400 text-sm font-medium">Nessuna spesa in questa categoria</p></div>
                )}
            </div>
        </div>

      {/* SEZIONE STORICO DONAZIONI */}
        <div className="mb-10"><h2 className="text-base font-extrabold text-secondary mb-3">Informazioni</h2><p className="text-sm text-slate-500 leading-relaxed text-justify mb-6 font-medium">{projectInfo.descrizione}</p><h3 className="text-base font-extrabold text-secondary mb-3">Come useremo i fondi?</h3><ul className="space-y-2">{projectInfo.usoFondi.map((item, index) => (<li key={index} className="flex items-center gap-2 text-sm text-slate-500 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>{item}</li>))}</ul></div>
        <div className="mb-12"><div className="flex justify-between items-center mb-6 cursor-pointer hover:opacity-70 transition" onClick={() => navigate('/storico-donazioni')}><h2 className="text-base font-extrabold text-secondary">Donazioni ricevute</h2><Icon icon="mdi:arrow-right" className="text-secondary text-2xl" /></div><div className="flex flex-col gap-1">{donatori.map((donatore) => (<div key={donatore.id} className="flex items-start justify-between py-3 border-b border-slate-50 last:border-0"><div className="flex items-start gap-3"><img src={donatore.avatar} alt={donatore.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" /><div className="flex flex-col"><p className="text-sm font-bold text-secondary">{donatore.name} <span className="font-normal text-slate-500">donated</span> {donatore.amount} <span className="text-xs font-bold text-slate-400">{donatore.currency}</span></p><p className="text-xs text-slate-400 italic mt-1">"{donatore.msg}"</p></div></div><span className="text-[10px] text-slate-400 font-medium whitespace-nowrap mt-1">{donatore.time}</span></div>))}</div></div>


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
    </div>
  );
}