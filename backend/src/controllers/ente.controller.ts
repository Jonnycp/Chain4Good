import type { Request, Response } from "express";
import { UserModel } from "../models/User.ts";
import { Types } from "mongoose";
import { ProjectModel } from "../models/Project.ts";

/**
 * Endpoint GET /ente/:id
 * Restituisce informazioni di un ente specifico
 * */

export const getEnteById = async (req: Request, res: Response) => {
  try {
    const enteId = req.params.id?.trim();

    if (!enteId || !Types.ObjectId.isValid(enteId)) {
      return res.status(400).json({ error: "ID ente non valido", code: 400 });
    }

    const ente = await UserModel.findById(enteId).select(
      "enteDetails profilePicture isEnte address"
    );

    if (!ente || !ente.isEnte) {
      return res.status(404).json({ error: "Ente non trovato", code: 404 });
    }

    const isMe = req.session.address == ente.address;
    
    const projects = await ProjectModel.aggregate([
          { $match: { ente: ente._id } },
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

    res.status(200).json( {
      ...ente.enteDetails,
      profilePicture: ente.profilePicture,
      isEnte: ente.isEnte,
      _id: ente._id,
      isMe,
      projects
    } );
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dell'ente", code: 500 });
  }
};