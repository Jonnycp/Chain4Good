import { Router } from 'express';
import authRoutes from './auth.routes.ts';
import projectRoutes from './project.routes.ts';
import enteRoutes from './ente.routes.ts';

const router = Router();

router.use('/auth', authRoutes); 
router.use('/projects', projectRoutes);
router.use('/ente', enteRoutes);

export default router;