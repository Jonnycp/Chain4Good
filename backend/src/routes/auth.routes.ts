import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.ts'; 

const router = Router();

// Login flow:
// Nonce => Firma => Verifica => Sessione

router.post('/nonce', AuthController.getNonce);

router.post('/verify', AuthController.verifySignature);

router.post('/logout', AuthController.logout);

router.get('/me', AuthController.getUser);

export default router;