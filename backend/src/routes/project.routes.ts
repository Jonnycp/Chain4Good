import { Router } from 'express';
import * as ProjectController from '../controllers/projects.controller.ts'; 
import * as DonationController from '../controllers/donations.controller.ts';
import * as SpeseController from '../controllers/spese.controller.ts';
import { isAuth, isEnte } from '../middleware/auth.middleware.ts';
import { isDonator, isProjectCreator } from '../middleware/projects.middleware.ts';
import multer from "multer";
import path from "path";

const router = Router();
const storageProject = multer.diskStorage({
  destination: "uploads/projects",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Nome file: timestamp-projectCover-nomeoriginale(slice6).ext
    const filename = `${Date.now()}-projectCover-${file.originalname.replace(/\s+/g, "_").slice(0, 6)}${ext}`;
    cb(null, filename);
  },
});
const storagePreventivo = multer.diskStorage({
  destination: "uploads/spese/preventivi",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Nome file: timestamp-preventivi-nomeoriginale(slice6).ext
    const filename = `${Date.now()}-preventivi-${file.originalname.replace(/\s+/g, "_").slice(0, 6)}${ext}`;
    cb(null, filename);
  },
});

const uploadProject = multer({ storage: storageProject });
const uploadPreventivo = multer({ storage: storagePreventivo });

router.get('/', isAuth, ProjectController.getProjects);

router.get('/categories', ProjectController.getCategories);

router.get("/supported", isAuth, ProjectController.getProjectSupported);

router.get("/me", isAuth, isEnte, ProjectController.getMyProjects);

router.get('/:id', isAuth, isDonator, ProjectController.getProjectById);

router.get('/:id/donations', isAuth, isDonator, DonationController.getProjectDonations);

router.post("/:id/donate", isAuth, isDonator,DonationController.donateToProject);

router.post('/:id/spese/new', isAuth, isProjectCreator, uploadPreventivo.single("preventivo"), SpeseController.createSpesa);

router.get('/:id/spese', isAuth, isDonator, SpeseController.getProjectSpese);

router.post('/:id/spese/:spesaId/vote', isAuth, isDonator, SpeseController.voteSpesa);

router.post('/new', isAuth, isEnte, uploadProject.single("coverImage"), ProjectController.createProject);


export default router;