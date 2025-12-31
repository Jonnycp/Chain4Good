import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.ts'; 
import { isAuth } from '../middleware/auth.middleware.ts';

const router = Router();

// Login flow:
// Nonce => Firma => Verifica => Sessione

router.post('/nonce', AuthController.getNonce);

router.post('/verify', AuthController.verifySignature);

router.post('/logout', AuthController.logout);

router.get('/me', isAuth, AuthController.getUser);

export default router;