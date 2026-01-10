import { Router } from 'express';
import * as EnteController from '../controllers/ente.controller.ts'; 
import { isAuth, isEnte } from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/:id', isAuth, EnteController.getEnteById);

export default router;