import type { Request, Response } from "express";
import { ProjectModel } from "../models/Project.ts";
import { DonationModel } from "../models/Donation.ts";
import { CATEGORY_ENUM } from "../models/Project.ts";

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

    const filter: any = { status: { $nin: ["annullato", "completato", "attivo"] } }; // not-in: Escludi annullati e completati

    if (category) filter.category = category;
    if (near) filter.location = new RegExp(near as string, "i"); //case insensitive, match parziale

    const projectsWithStats = await ProjectModel.aggregate([
      { $match: filter },
      { //Join con ente
        $lookup: {
          from: "users",
          localField: "ente",
          foreignField: "_id",
          as: "ente"
        }
      },
      { $unwind: "$ente" }, //trasforma in oggetto singolo
      { //Join con donazioni
        $lookup: { 
          from: "donations",
          let: { projectId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$project", "$$projectId"] } } },
            { $sort: { date: -1 } }, //TODO: Appesantisce query unire tutte le donazioni
          ],
          as: "donazioni"
        }
      },
      { //join con utenti donatori
        $lookup: {
          from: "users",
          let: { donorIds: { $slice: ["$donazioni.donor", 5] } },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$donorIds"] } } },
            { $project: { _id: 1, profilePicture: 1 } }
          ],
          as: "lastDonors"
        }
      },
      { //Render finale
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
                profilePicture: "$$d.profilePicture"
              }
            }
          },
          ente: {
            id: "$ente._id",
            nome: "$ente.enteDetails.nome",
            profilePicture: "$ente.profilePicture"
          }
        }
      },
      { $sort: { [(sort as string) || "createdAt"]: order === "asc" ? 1 : -1 } },
      ...(limit ? [{ $limit: Number(limit) }] : [])
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
  }
  catch (error) {
    res
      .status(500)
      .json({ error: "Errore nel caricamento categorie", code: 500 });
  }
};
