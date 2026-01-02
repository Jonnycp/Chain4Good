import type { Request, Response } from "express";
import { ProjectModel } from "../models/Project.ts";
import { DonationModel } from "../models/Donation.ts";
import { UserModel } from "../models/User.ts";
import { CATEGORY_ENUM } from "../models/Project.ts";
import { Types } from "mongoose";

/**
 * Endpoint GET /projects
 * Restituisce lista progetti, filtrata con parametri opzionali:
 * limit= numero > 0
 * order= asc | desc
 * sort= endDate | createdAt
 * category= medical | ...
 * near= nomeCitta
 */

export const getProjects = async (req: Request, res: Response) => {
  try {
    const allowedSortFields = ["endDate", "createdAt"];
    const allowedOrders = ["asc", "desc"];

    let { category, sort, order, limit, near } = req.query;

    // Validazione categoria
    if (category && !CATEGORY_ENUM.includes(category as any)) {
      return res
        .status(400)
        .json({ error: "Categoria non trovata", code: 400 });
    }

    // Validazione e cleaning near (solo lettere e numeri)
    if (near) {
      near = (near as string).replace(/[^a-zA-Z0-9\s]/g, "");
    }

    // Validazione sort
    if (sort && !allowedSortFields.includes(sort as string)) {
      return res
        .status(400)
        .json({ error: "Campo sort non valido", code: 400 });
    }

    // Validazione order
    if (order && !allowedOrders.includes(order as string)) {
      return res.status(400).json({ error: "Ordine non valido", code: 400 });
    }

    // Validazione limit
    if (limit && (isNaN(Number(limit)) || Number(limit) <= 0)) {
      return res.status(400).json({ error: "Limite non valido", code: 400 });
    }

    const filter: any = {
      status: { $nin: ["annullato", "completato", "attivo"] },
    }; // not-in: Escludi annullati e completati

    if (category) filter.category = category;
    if (near) filter.location = new RegExp(near as string, "i"); //case insensitive, match parziale

    const projectsWithStats = await ProjectModel.aggregate([
      { $match: filter },
      {
        //Join con ente
        $lookup: {
          from: "users",
          localField: "ente",
          foreignField: "_id",
          as: "ente",
        },
      },
      { $unwind: "$ente" }, //trasforma in oggetto singolo
      {
        //Join con donazioni
        $lookup: {
          from: "donations",
          let: { projectId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$project", "$$projectId"] } } },
            { $sort: { createdAt: -1 } }, //TODO: Appesantisce query unire tutte le donazioni
          ],
          as: "donazioni",
        },
      },
      {
        // Join con utenti donatori
        $lookup: {
          from: "users",
          let: {
            donorIds: { $slice: ["$donazioni.donor", 5] },
          },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$donorIds"] } } },
            { $project: { _id: 1, profilePicture: 1 } },
          ],
          as: "lastDonors",
        },
      },
      {
        //Render finale
        $project: {
          titolo: "$title",
          cover: "$coverImage",
          stato: "$status",
          luogo: "$location",
          endDate: "$endDate",
          targetAmount: "$targetAmount",
          currentAmount: "$currentAmount",
          createdAt: "$createdAt",
          currency: "$currency",
          numeroDonatori: { $size: { $setUnion: ["$donazioni.donor", []] } },
          lastDonors: {
            $map: {
              input: "$lastDonors",
              as: "d",
              in: {
                id: "$$d._id",
                profilePicture: "$$d.profilePicture",
              },
            },
          },
          ente: {
            id: "$ente._id",
            nome: "$ente.enteDetails.nome",
            profilePicture: "$ente.profilePicture",
          },
        },
      },
      {
        $sort: { [(sort as string) || "createdAt"]: order === "asc" ? 1 : -1 },
      },
      ...(limit ? [{ $limit: Number(limit) }] : []),
    ]);

    res.json(projectsWithStats);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Errore nel caricamento progetti", code: 500 });
  }
};

/**
 * Endpoint GET /projects/categories
 * Restituisce lista categorie progetti
 * */

export const getCategories = async (req: Request, res: Response) => {
  try {
    res.json(CATEGORY_ENUM);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Errore nel caricamento categorie", code: 500 });
  }
};

/**
 * Endpoint GET /projects/me
 * Restituisce lista di progetti creati dall'ente autenticato
 * */
export const getMyProjects = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({ address: req.session.address! });

    if (!user) {
      return res.status(404).json({ error: "Utente non trovato", code: 404 });
    }
    const projectsWithStats = await ProjectModel.aggregate([
      { $match: { ente: user._id } },
      {
        $lookup: {
          from: "users",
          localField: "ente",
          foreignField: "_id",
          as: "ente",
        },
      },
      { $unwind: "$ente" },
      {
        $lookup: {
          from: "donations",
          let: { projectId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$project", "$$projectId"] } } },
            { $sort: { createdAt: -1 } },
          ],
          as: "donazioni",
        },
      },
      {
        $lookup: {
          from: "users",
          let: { donorIds: { $slice: ["$donazioni.donor", 5] } },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$donorIds"] } } },
            { $project: { _id: 1, profilePicture: 1 } },
          ],
          as: "lastDonors",
        },
      },
      {
        $project: {
          titolo: "$title",
          cover: "$coverImage",
          stato: "$status",
          luogo: "$location",
          endDate: "$endDate",
          targetAmount: "$targetAmount",
          currentAmount: "$currentAmount",
          createdAt: "$createdAt",
          currency: "$currency",
          numeroDonatori: { $size: { $setUnion: ["$donazioni.donor", []] } },
          lastDonors: {
            $map: {
              input: "$lastDonors",
              as: "d",
              in: {
                id: "$$d._id",
                profilePicture: "$$d.profilePicture",
              },
            },
          },
          ente: {
            id: "$ente._id",
            nome: "$ente.enteDetails.nome",
            profilePicture: "$ente.profilePicture",
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.json(projectsWithStats);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Errore nel caricamento dei progetti", code: 500 });
  }
};

/**
 * Endpoint GET /projects/:id
 * Restituisce i dettagli di un progetto dato il suo ID
 */

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;

    const project = await ProjectModel.findById(projectId).populate<{
      ente: {
        _id: string;
        profilePicture: string;
        enteDetails: {
          nome: string;
          denominazioneSociale: string;
        };
      };
    }>({
      path: "ente",
      select:
        "_id profilePicture enteDetails.nome enteDetails.denominazioneSociale",
    });

    if (!project) {
      return res.status(404).json({ error: "Progetto non trovato", code: 404 });
    }

    const user = await UserModel.findOne({ address: req.session.address! }); //TODO: sarebbe meglio mettere in sessione l'id
    const isMy = user?._id.toString() === project?.ente._id.toString();

    const ente = {
      _id: project.ente._id,
      profilePicture: project.ente.profilePicture,
      nome: project.ente.enteDetails?.nome,
      denominazioneSociale: project.ente.enteDetails?.denominazioneSociale,
    };

    res.json({ ...project.toObject(), isMy, ente });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Errore nel caricamento del progetto", code: 500 });
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
