import { Router } from "express";
import { checkAuth, createContent, deleteContent, getContent, signin, signup, updateContent, uploadAudio, uploadImage, } from "../controllers/auth.controllers";
import { authMiddleware } from "../middleware/auth.middleware";
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const authRouter = Router();

authRouter.post('/signup', signup)

authRouter.post('/signin', signin)

authRouter.get('/get-content', authMiddleware, getContent)

authRouter.post('/content/create-content', authMiddleware, createContent)

authRouter.put('/content/update-content', authMiddleware, updateContent)

authRouter.put('/content/upload-image', uploadImage);

authRouter.post('/content/upload-audio', authMiddleware, upload.single('audio'), uploadAudio);

authRouter.delete('/content/delete-content', authMiddleware, deleteContent)

authRouter.get('/check-auth', authMiddleware, checkAuth)

export default authRouter;