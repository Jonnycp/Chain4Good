import type { Request, Response } from "express";
import { ProjectModel } from "../models/Project.ts";
import { SpesaModel } from "../models/Spesa.ts";
import { Types } from "mongoose";

/**
 * Endpoint POST /projects/:id/spese/new
 * Crea una nuova spesa, con questi parametri nel body:
 * title
 * category
 * amount
 * description
 * preventivo (file)
 * requestId (number)
 * hashCreation
 */
export const createSpesa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      amount,
      description,
      hashCreation,
      requestId
    } = req.body;
    const preventivo = req.file ? req.file.path : "";

    const errors: Record<string, string> = {};

    // Validazioni
    if (!title || typeof title !== "string" || title.length < 3)
      errors.title = "Titolo non valido";
    if (!category || typeof category !== "string")
      errors.category = "Categoria non valida";
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      errors.amount = "Importo non valido";
    if (!description || typeof description !== "string" || description.length < 10)
      errors.description = "Descrizione troppo corta";
    if (!hashCreation || typeof hashCreation !== "string" || hashCreation.length < 10)
      errors.hashCreation = "Hash creazione non valido";
    if (!requestId || isNaN(Number(requestId)))
      errors.requestId = "Request ID non valido";
    if (!preventivo) {
      errors.preventivo = "Preventivo non valido";
    } else {
      // Controllo estensione
      const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".webp"];
      const ext = preventivo.substring(preventivo.lastIndexOf(".")).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        errors.preventivo = "Formato file non supportato (PDF, PNG, JPG, JPEG, WEBP)";
      }
      // Controllo dimensione file (max 10MB)
      if (req.file && req.file.size > 10 * 1024 * 1024) {
        errors.preventivo = "Il file non deve superare i 10MB";
      }
      // Controllo mimetype
      const allowedMimeTypes = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];
      if (req.file && !allowedMimeTypes.includes(req.file.mimetype)) {
        errors.preventivo = "Tipo di file non valido";
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: errors, code: 400 });
    }

    // Verifica esistenza progetto
    const project = await ProjectModel.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Progetto non trovato" });
    }

    if(project.status !== "attivo") {
      return res.status(400).json({ error: "Impossibile aggiungere spese a un progetto non attivo", code: 400 });
    }
    
    const speseProgetto = await SpesaModel.find({ projectId: new Types.ObjectId(id) });
    const sommaSpese = speseProgetto.reduce((acc, spesa) => acc + (spesa.amount || 0), 0);
    const spesaNonVerificata = speseProgetto.find(spesa => spesa.proof === undefined && spesa.executed === true);

    if (spesaNonVerificata) {
        return res.status(400).json({ error: "Devi prima verificare la spesa precedente, allegando una prova di spesa", code: 400 });
    }
    if (sommaSpese + Number(amount) > project.currentAmount) {
        return res.status(400).json({ error: "Il totale delle spese supera il budget del progetto", code: 400 });
    }

    // Crea la spesa
    const newSpesa = await SpesaModel.create({
      title: title.trim(),
      category: category.trim(),
      amount: Number(amount),
      description: description.trim(),
      preventivo,
      hashCreation: hashCreation.trim(),
      projectId: new Types.ObjectId(id),
      requestId: Number(requestId),
      status: "votazione",
    });

    res.status(201).json({ success: true, spesa: newSpesa });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Errore nella creazione della spesa", details: error });
  }
};

/**
 * Endpoint GET /projects/:id/spese
 * Restituisce lista spese, filtrata con parametri opzionali:
 * limit= numero > 0
 * order= asc | desc
 * sort= createdAt | amount
 * status= votazione | approvata | rifiutata | verificata
 */
export const getProjectSpese = async (req: Request, res: Response) => {
  try {
    const allowedOrders = ["asc", "desc"];
    const allowedSorts = ["createdAt", "amount"];
    const allowedStatus = ["votazione", "approvata", "rifiutata"];

    const { id } = req.params;
    let { order, limit, sort, status } = req.query;

    // Validazione id progetto
    if (!id || typeof id !== "string" || id.length !== 24) {
      return res.status(400).json({ error: "ID progetto non valido", code: 400 });
    }

    // Validazione order
    if (order && !allowedOrders.includes(order as string)) {
      return res.status(400).json({ error: "Ordine non valido", code: 400 });
    }

    // Validazione limit
    if (limit && (isNaN(Number(limit)) || Number(limit) <= 0)) {
      return res.status(400).json({ error: "Limite non valido", code: 400 });
    }

    // Validazione sort
    if (sort && !allowedSorts.includes(sort as string)) {
      return res.status(400).json({ error: "Campo di ordinamento non valido", code: 400 });
    }

    // Validazione status
    if (status && !allowedStatus.includes(status as string)) {
      return res.status(400).json({ error: "Status non valido", code: 400 });
    }

    const filter: any = { projectId: id };
    if (status) filter.status = status;
    let speseQuery = SpesaModel.find(filter);

    // Ordinamento
    if (sort) {
      const sortOrder = order === "asc" ? 1 : -1;
      speseQuery = speseQuery.sort({ [sort as string]: sortOrder });
    } else {
      // Default: createdAt desc
      speseQuery = speseQuery.sort({ createdAt: -1 });
    }

    // Limite
    if (limit) speseQuery = speseQuery.limit(Number(limit));

    const spese = await speseQuery.exec();
    const sommaSpese = spese.reduce((acc, spesa) => acc + (spesa.amount || 0), 0);
    const spesaNonVerificata = spese.find((spesa) => spesa.proof === undefined && spesa.executed === true);

    const myAddress = req.session.address?.toLowerCase();

    // Per ogni spesa, aggiungi il campo myVote
    const speseWithMyVote = spese.map((spesa) => {
      let myVote = null;
      if (myAddress && spesa.votes && spesa.votes.voters) {
        const voters = spesa.votes.voters as Map<string, any>;
        const voter = voters.get(myAddress) || voters.get(myAddress.toLowerCase());
        if (voter) {
          myVote = voter.vote;
        }
      }
      return {
        ...spesa.toObject(),
        myVote,
      };
    });

    res.json({
      spese: speseWithMyVote,
      sommaSpese,
      spesaNonVerificata: spesaNonVerificata ? spesaNonVerificata._id : null,
    });
  } catch (error) {
    res.status(500).json({ error: "Errore nel caricamento delle spese", code: 500 });
  }
};
