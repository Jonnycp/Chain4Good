import type { Request, Response, NextFunction } from "express";
import { DonationModel } from "../models/Donation.ts";
import { ProjectModel } from "../models/Project.ts";
import { UserModel } from "../models/User.ts";
import { Types } from "mongoose";

export const isProjectCreator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session || !req.session.address) {
    return res.status(401).json({
      error: "Accesso negato. Devi essere autenticato con il tuo wallet.",
      code: 401,
    });
  }

  try {
    const projectId = req.params.id;
    const user = await UserModel.findOne({ address: req.session.address });
    if (!user)
      return res.status(404).json({ error: "Utente non trovato", code: 404 });

    const project = await ProjectModel.findById(projectId);

    if (!project)
      return res.status(404).json({ error: "Progetto non trovato" });

    if (project.ente.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({
          error:
            "Accesso negato: solo l'ente creatore può eseguire questa operazione",
          code: 403,
        });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Errore nel controllo delle autorizzazioni", code: 500 });
  }
};

export const isDonator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    if (!req.session || !req.session.address) {
    return res.status(401).json({
      error: "Accesso negato. Devi essere autenticato con il tuo wallet.",
      code: 401,
    });
  }
  try {
    const projectId = req.params.id;
    const user = await UserModel.findOne({ address: req.session.address });
    if (!user)
      return res.status(404).json({ error: "Utente non trovato", code: 404 });

    const project = await ProjectModel.findById(projectId);
    if (!project)
      return res.status(404).json({ error: "Progetto non trovato" });

    if(project.status === "raccolta"){
      return next();
    }
    if (project.ente.toString() === user._id.toString()) {
      return next();
    }

    const hasDonated = await DonationModel.exists({
      project: new Types.ObjectId(projectId),
      donor: user._id,
    });

    if (!hasDonated) {
      return res
        .status(403)
        .json({
          error: "Accesso negato: devi aver donato per vedere questi dettagli",
        });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Errore nel controllo donatore" });
  }
};
