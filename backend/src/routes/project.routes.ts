import { Router } from 'express';
import * as ProjectController from '../controllers/projects.controller.ts'; 
import { isAuth, isEnte } from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/', isAuth, ProjectController.getProjects);

router.get('/categories', ProjectController.getCategories);

router.get("/me", isAuth, isEnte, ProjectController.getMyProjects);

// router.get('/:id', isAuth, ProjectController.getProjectById);

// router.get("/donated", isAuth, ProjectController.getMyDonations);

export default router;