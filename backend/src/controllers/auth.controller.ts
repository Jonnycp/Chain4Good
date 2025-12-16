import type { Request, Response } from 'express';
import { generateNonce, SiweMessage } from 'siwe';

/**
 * Endpoint GET /auth/nonce
 * Genera un nonce unico e lo salva nella sessione utente.
 */
export const getNonce = (req: Request, res: Response) => {
    try {
        const nonce = generateNonce();
        req.session.nonce = nonce; 
        
        res.status(200).send(nonce);
    } catch (error) {
        console.error('Errore nella generazione del nonce:', error);
        res.status(500).json({ error: 'Errore nella generazione del nonce', code: 500 } );
    }
};


/**
 * Endpoint POST /auth/verify
 * Riceve il messaggio e la firma dal frontend e verifica l'autenticità SIWE.
 */
export const verifySignature = async (req: Request, res: Response) => {
    if (!req.session.nonce) {
        return res.status(400).json({ error: 'Nonce di sessione mancante. Richiedi un nuovo nonce.', code: 400 });
    }
    
    const { message, signature } = req.body;
    if (!message || !signature) {
        return res.status(400).json({ error: 'Messaggio o firma mancanti nel corpo della richiesta.', code: 400 });
    }

    try {
        const siweMessage = new SiweMessage(message);
        
        // La libreria SIWE verifica che:
        // a) La firma sia valida per il messaggio dato.
        // b) L'indirizzo nel messaggio corrisponda all'indirizzo che ha firmato.
        // c) Il nonce nel messaggio corrisponda a quello salvato nella sessione.
        const { success, data } = await siweMessage.verify({
            signature,
            nonce: req.session.nonce 
        });

        if (success) {
            req.session.address = data.address;
            req.session.chainId = data.chainId; 
            delete req.session.nonce; // Invalida il nonce dopo l'uso
            
            res.status(200).json({ address: data.address, loggedIn: true });
        } else {
            res.status(401).json({ error: 'Verifica fallita (firma o nonce non validi).', code: 401 });
        }

    } catch (error) {
        console.error('SIWE Verification Error:', error);
        res.status(400).json({ error: 'Formato del messaggio SIWE non valido o errore interno del server.', code: 400 });
    }
};

/**
 * Endpoint POST /auth/logout
 * Distrugge la sessione e disconnette l'utente.
 */
export const logout = (req: Request, res: Response) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Impossibile effettuare il logout', code: 500 });
        }
        res.status(200).send('Logout effettuato con successo');
    });
};