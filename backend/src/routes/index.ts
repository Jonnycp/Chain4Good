import { Router } from 'express';
import authRoutes from './auth.routes.ts';
import projectRoutes from './project.routes.ts';

const router = Router();

router.use('/auth', authRoutes); 
router.use('/projects', projectRoutes);

export default router;