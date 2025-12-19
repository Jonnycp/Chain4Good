import { Router } from 'express';
import * as ProjectController from '../controllers/projects.controller.ts'; 
import { isAuth } from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/', isAuth, ProjectController.getProjects);

router.get('/categories', ProjectController.getCategories);

// router.get('/:id', isAuth, ProjectController.getProjectById);

// router.get("/donated", isAuth, ProjectController.getMyDonations);

// router.get("/me", isAuth, ProjectController.getMyCreatedProjects)


export default router;