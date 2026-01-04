import type { Request, Response } from "express";
import { generateNonce, SiweMessage } from "siwe";
import { UserModel } from "../models/User.ts";
import {
  checkIfIsEnte,
  getContractAddress,
} from "../services/blockchain.service.ts";

/**
 * Endpoint POST /auth/nonce
 * Genera un nonce unico e lo salva nel db se utente esiste già, altrimenti in sessione.
 * Si evita di creare utenti per ridurre spam (indirizzi non verificati)
 * Si usa il db per un eventuale Load balancer in futuro.
 */
export const getNonce = async (req: Request, res: Response) => {
  const walletAddress = req.body.address.toLowerCase() as string;
  if (!walletAddress) {
    return res
      .status(400)
      .json({ error: "Indirizzo wallet mancante.", code: 400 });
  }

  try {
    const existingUser = await UserModel.findOne({ address: walletAddress });
    const newNonce = generateNonce();

    if (!existingUser) {
      req.session.nonce = newNonce;
      req.session.address = walletAddress; //TODO: Indirizzo temporeaneo
    } else {
      existingUser.nonce = newNonce;
      await existingUser.save();
    }

    res.status(200).json({ nonce: newNonce });
  } catch (error) {
    console.error("Errore nella generazione del nonce:", error);
    res
      .status(500)
      .json({ error: "Errore nella generazione del nonce", code: 500 });
  }
};

/**
 * Endpoint POST /auth/verify
 * Riceve il messaggio e la firma dal frontend e verifica l'autenticità SIWE.
 */
export const verifySignature = async (req: Request, res: Response) => {
  const { message, signature } = req.body;
  if (!message || !signature) {
    return res.status(400).json({
      error: "Messaggio o firma mancanti nel corpo della richiesta.",
      code: 400,
    });
  }

  try {
    const siweMessage = new SiweMessage(message);
    const { success, data } = await siweMessage.verify({
      signature,
    });

    if (success) {
      let user = await UserModel.findOne({
        address: data.address.toLowerCase(),
      });
      const isVerifiedEnte = await checkIfIsEnte(data.address.toLowerCase());

      if (!user) {
        if (
          data.nonce !== req.session.nonce ||
          data.address.toLowerCase() !== req.session.address
        ) {
          return res.status(401).json({
            error: "Verifica fallita: nonce non valido.",
            code: 401,
          });
        } else {
          user = await UserModel.create({
            address: data.address.toLowerCase(),
            nonce: generateNonce(),
            username: `user-${data.address.toLowerCase().substring(0, 6)}`,
            profilePicture:
              "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=" +
              data.address.toLowerCase(),
            isEnte: isVerifiedEnte,
          });
        }
      } else {
        if (data.nonce !== user.nonce) {
          return res.status(401).json({
            error: "Verifica fallita: nonce non valido.",
            code: 401,
          });
        } else {
          user.isEnte = isVerifiedEnte;
          user.nonce = generateNonce();
          await user.save();
        }
      }

      delete req.session.nonce;
      req.session.address = data.address.toLowerCase();
      req.session.chainId = data.chainId;

      res.status(200).json({ data: user });
    } else {
      res.status(401).json({
        error: "Verifica fallita (firma o nonce non validi).",
        code: 401,
      });
    }
  } catch (error) {
    console.error("SIWE Verification Error:", error);
    res.status(400).json({
      error:
        "Formato del messaggio SIWE non valido o errore interno del server.",
      code: 400,
    });
  }
};

/**
 * Endpoint POST /auth/logout
 * Distrugge la sessione e disconnette l'utente.
 */
export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Impossibile effettuare il logout", code: 500 });
    }
    res.status(200).send("Logout effettuato con successo");
  });
};

/**
 * Endpoint GET /auth/me
 * Ottiene dati sull'utente autenticato.
 */
export const getUser = async (req: Request, res: Response) => {
  if (!req.session.address) {
    return res.status(401).json({ error: "Non autenticato", code: 401 });
  }

  try {
    const user = await UserModel.findOne({ address: req.session.address });
    if (!user)
      return res.status(404).json({ error: "Utente non trovato", code: 404 });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Errore server", code: 500 });
  }
};

export const getContracts = async (req: Request, res: Response) => {
  try {
    const addresses = getContractAddress();
    if (!addresses)
      return res.status(500).json({ error: "Config non trovata" });

    res.json({
      eurc: addresses.eurc,
      factory: addresses.factory,
      enteNft: addresses.enteNft,
    });
  } catch (error) {
    res.status(500).json({ error: "Errore server", code: 500 });
  }
};
