import type { Request, Response } from "express";
import { Types } from "mongoose";
import { DonationModel } from "../models/Donation.ts";
import { ProjectModel } from "../models/Project.ts";
import { UserModel } from "../models/User.ts";

/**
 * Endpoint POST /projects/:id/donate
 * Dona a un progetto, con questi parametri nel body:
 * amount
 * hashTransaction
 * messaggio (opzionale)
 */
export const donateToProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, hashTransaction, messaggio } = req.body;

    const project = await ProjectModel.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Progetto non trovato", code: 404 });
    }

    const user = await UserModel.findOne({ address: req.session.address! });
    if (!user) {
      return res.status(404).json({ error: "Utente non trovato", code: 404 });
    }

    // Validazioni di base
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: "Importo non valido", code: 400 });
    }
    if (Number(amount) + project.currentAmount > project.targetAmount) {
      return res.status(400).json({
        error: "Importo eccede il budget rimanente del progetto",
        code: 400,
      });
    }
    if (
      !hashTransaction ||
      typeof hashTransaction !== "string" ||
      !/^0x([A-Fa-f0-9]{64})$/.test(hashTransaction)
    ) {
      return res
        .status(400)
        .json({ error: "Hash transazione non valido", code: 400 });
    }
    if (
      messaggio &&
      (typeof messaggio !== "string" || messaggio.length > 500)
    ) {
      return res.status(400).json({ error: "Messaggio non valido", code: 400 });
    }
    if (user._id.equals(project.ente)) {
      return res
        .status(400)
        .json({ error: "Non puoi donare a un tuo progetto", code: 400 });
    }
    if (new Date() > new Date(project.endDate) || project.status !== "raccolta") {
      return res
        .status(400)
        .json({ error: "Raccolta fondi terminata", code: 400 });
    }

    // Crea donazione
    const newDonation = await DonationModel.create({
      project: project._id,
      donor: user._id,
      amount: Number(amount),
      hashTransaction: hashTransaction,
      symbol: project.currency,
      messaggio: messaggio ? messaggio.trim() : "",
    });

    const isNewDonor = !(await DonationModel.exists({ project: project._id, donor: user._id }));

    //TODO: dovrebbe prendere i valori on-chain per sicurezza
    const updatedProject = await ProjectModel.findByIdAndUpdate(
      //Per concorrenza
      id,
      { $inc: { currentAmount: Number(amount), uniqueDonorsCount: isNewDonor ? 1 : 0 } },
      { new: true }
    );

    if (
      updatedProject &&
      (updatedProject.currentAmount >= updatedProject.targetAmount ||
        new Date() > new Date(updatedProject.endDate)) &&
      updatedProject.status === "raccolta"
    ) {
      updatedProject.status = "attivo";
      await updatedProject.save();
    }

    res.status(201).json({ success: true, donation: newDonation });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Errore nella donazione al progetto", code: 500 });
  }
};

/**
 * Endpoint GET /projects/:id/donations
 * Restituisce lista donazioni, filtrata con parametri opzionali:
 * limit= numero > 0
 * order= asc | desc
 * donor=idUtente
 */
export const getProjectDonations = async (req: Request, res: Response) => {
  try {
    const allowedOrders = ["asc", "desc"];

    const { id } = req.params;
    let { order, limit, donor } = req.query;

    // Validazione id progetto
    if (!id || typeof id !== "string" || id.length !== 24) {
      return res
        .status(400)
        .json({ error: "ID progetto non valido", code: 400 });
    }

    // Validazione order
    if (order && !allowedOrders.includes(order as string)) {
      return res.status(400).json({ error: "Ordine non valido", code: 400 });
    }

    // Validazione limit
    if (limit && (isNaN(Number(limit)) || Number(limit) <= 0)) {
      return res.status(400).json({ error: "Limite non valido", code: 400 });
    }

    // Validazione donor
    if (donor && (typeof donor !== "string" || donor.length !== 24)) {
      return res
        .status(400)
        .json({ error: "ID donatore non valido", code: 400 });
    }

    const filter: any = { project: id };
    if (donor) filter.donor = donor;

    const donationsQuery = DonationModel.find(filter)
      .select("donor messaggio amount symbol createdAt hashTransaction")
      .populate<{
        donation: {
          _id: Types.ObjectId;
          project: Types.ObjectId;
          donor: Types.ObjectId;
          messaggio?: string;
          amount: number;
          symbol: string;
          hashTransaction: string;
          createdAt: Date;
          updatedAt: Date;
        };
      }>({ path: "donor", select: "_id username profilePicture" });

    if (limit) donationsQuery.limit(Number(limit));

    const donations = await donationsQuery.exec();

    const donors = donations.map((d) => {
      let donorObj: any = d.donor;
      return {
        id: donorObj?._id ? donorObj._id.toString() : donorObj?.toString(),
        profilePicture: donorObj?.profilePicture || null,
        username: donorObj?.username || "Anonimo",
        messaggio: d.messaggio,
        amount: d.amount,
        symbol: d.symbol,
        createdAt: d.createdAt,
        hashTransaction: d.hashTransaction,
      };
    });

    const allDonors = await DonationModel.distinct("donor", { project: id });
    const totDonors = allDonors.length;

    res.json({
      totDonors,
      donors,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Errore nel caricamento delle donazioni", code: 500 });
  }
};
