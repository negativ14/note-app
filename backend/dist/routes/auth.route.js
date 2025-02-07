"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = require("../controllers/auth.controllers");
const auth_middleware_1 = require("../middleware/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const authRouter = (0, express_1.Router)();
authRouter.post('/signup', auth_controllers_1.signup);
authRouter.post('/signin', auth_controllers_1.signin);
authRouter.get('/get-content', auth_middleware_1.authMiddleware, auth_controllers_1.getContent);
authRouter.post('/content/create-content', auth_middleware_1.authMiddleware, auth_controllers_1.createContent);
authRouter.put('/content/update-content', auth_middleware_1.authMiddleware, auth_controllers_1.updateContent);
authRouter.put('/content/upload-image', auth_controllers_1.uploadImage);
authRouter.post('/content/upload-audio', auth_middleware_1.authMiddleware, upload.single('audio'), auth_controllers_1.uploadAudio);
authRouter.delete('/content/delete-content', auth_middleware_1.authMiddleware, auth_controllers_1.deleteContent);
authRouter.get('/check-auth', auth_middleware_1.authMiddleware, auth_controllers_1.checkAuth);
exports.default = authRouter;
