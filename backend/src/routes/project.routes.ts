import { Router } from 'express';
import * as ProjectController from '../controllers/projects.controller.ts'; 
import { isAuth, isEnte } from '../middleware/auth.middleware.ts';
import multer from "multer";
import path from "path";

const router = Router();
const storage = multer.diskStorage({
  destination: "uploads/projects",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Nome file: timestamp-projectCover-nomeoriginale(slice6).ext
    const filename = `${Date.now()}-projectCover-${file.originalname.replace(/\s+/g, "_").slice(0, 6)}${ext}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

router.get('/', isAuth, ProjectController.getProjects);

router.get('/categories', ProjectController.getCategories);

router.get("/me", isAuth, isEnte, ProjectController.getMyProjects);

router.get('/:id', isAuth, ProjectController.getProjectById);

router.get('/:id/donations', isAuth, ProjectController.getProjectDonations);

router.post('/new', isAuth, isEnte, upload.single("coverImage"), ProjectController.createProject);

// router.get("/donated", isAuth, ProjectController.getMyDonations);

export default router;