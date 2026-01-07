import cron from "node-cron";
import { ProjectModel } from "../models/Project.ts";
import { SpesaModel } from "../models/Spesa.ts";

/**
 * Worker per la gestione degli stati dei progetti (Deadline)
 */
const projectStatusWorker = async () => {
  const oraAttuale = new Date();
  const result = await ProjectModel.updateMany(
    { status: "raccolta", endDate: { $lte: oraAttuale } },
    { $set: { status: "attivo" } }
  );
  if (result.modifiedCount > 0) {
    console.log(`[PROJECT WORKER] ${result.modifiedCount} progetti -> ATTIVO.`);
  }
};

/**
 * Worker per la gestione delle votazioni sulle spese
 */
const spesaGovernanceWorker = async () => {
  const oraAttuale = new Date();
  const treGiorniInMs = 3 * 24 * 60 * 60 * 1000;

  // 1. Troviamo tutte le spese in votazione
  const speseInVotazione = await SpesaModel.find({ status: "votazione" });
  if (speseInVotazione.length === 0) return;

  // 2. Raggruppiamo le spese per ID Progetto
  const spesePerProgetto: Record<string, any[]> = {};
  speseInVotazione.forEach(s => {
    const pId = s.projectId.toString();
    if (!spesePerProgetto[pId]) spesePerProgetto[pId] = [];
    spesePerProgetto[pId].push(s);
  });

  // 3. Iteriamo sui progetti unici trovati
  for (const projectId in spesePerProgetto) {
    try {
      const project = await ProjectModel.findById(projectId).select("uniqueDonorsCount");
      if (!project) continue;

      const totalDonors = (project as any).uniqueDonorsCount || 0;
      if (totalDonors === 0) continue;

      // 4. Processiamo tutte le spese di questo specifico progetto
      for (const spesa of spesePerProgetto[projectId]?.length ? spesePerProgetto[projectId] : []) {
        const currentVoters = spesa.votes.votesFor + spesa.votes.votesAgainst;
        const dataScadenza = new Date(spesa.createdAt.getTime() + treGiorniInMs);
        
        const timeEnded = oraAttuale >= dataScadenza;
        const mathMajority = spesa.votes.votesFor >= (totalDonors - currentVoters);
        const simpleMajority = spesa.votes.votesFor >= spesa.votes.votesAgainst;

        if (mathMajority || (timeEnded && simpleMajority)) {
          await SpesaModel.updateOne({ _id: spesa._id }, { $set: { status: "approvata" } });
          console.log(`[GOVERNANCE] Progetto ${projectId} - Spesa ${spesa._id} -> APPROVATA`);
        } else if (timeEnded && !simpleMajority) {
          await SpesaModel.updateOne({ _id: spesa._id }, { $set: { status: "rifiutata" } });
          console.log(`[GOVERNANCE] Progetto ${projectId} - Spesa ${spesa._id} -> RIFIUTATA`);
        }
      }
    } catch (err) {
      console.error(`[ERROR] Errore nel processing del progetto ${projectId}:`, err);
    }
  }
};

/**
 * Avvio centralizzato di tutti i task pianificati
 */
export const startWorkers = () => {
  console.log("🟢 Servizi Worker Chain4Good avviati.");

  cron.schedule('*/1 * * * *', () => {
    Promise.all([
      projectStatusWorker(),
      spesaGovernanceWorker()
    ]).catch(err => {
      console.error("[WORKER ERROR]", err);
    });
  });
};