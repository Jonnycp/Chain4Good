import type { Request, Response, NextFunction } from "express";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.address) {
    return res.status(401).json({ 
      error: "Accesso negato. Devi essere autenticato con il tuo wallet.", 
      code: 401 
    });
  }
  next();
};