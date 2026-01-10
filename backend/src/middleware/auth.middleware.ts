import type { Request, Response, NextFunction } from "express";
import { checkIfIsEnte } from "../services/blockchain.service.ts";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.address) {
    return res.status(401).json({ 
      error: "Accesso negato. Devi essere autenticato con il tuo wallet.", 
      code: 401 
    });
  }
  next();
};

export const isEnte = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.address ) {
    return res.status(401).json({ 
      error: "Accesso negato. Devi essere autenticato con il tuo wallet.", 
      code: 401
    });
  }
  const isVerified = await checkIfIsEnte(req.session.address);
  if (!isVerified) {
    return res.status(403).json({ 
      error: "Accesso negato: Non sei un ente autorizzato.",
      code: 403 
    });
  }

  next();
}