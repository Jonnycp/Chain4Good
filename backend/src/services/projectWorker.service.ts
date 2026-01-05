import { ProjectModel } from "../models/Project.ts";
import cron from "node-cron";

export const startProjectWorker = () => {
  // Pianifica il task: '*/1 * * * *' = "ogni minuto"
  cron.schedule('*/1 * * * *', async () => {
    try {
      const oraAttuale = new Date();

      const result = await ProjectModel.updateMany(
        {
          status: "raccolta",
          endDate: { $lte: oraAttuale }
        },
        {
          $set: { status: "attivo" }
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`[WORKER] ${result.modifiedCount} progetti sono passati allo stato ATTIVO per scadenza deadline.`);
      }
    } catch (error) {
      console.error("[WORKER ERROR] Errore durante l'aggiornamento automatico dei progetti:", error);
    }
  });

  console.log("🟢 Servizio di monitoraggio scadenze avviato.");
};