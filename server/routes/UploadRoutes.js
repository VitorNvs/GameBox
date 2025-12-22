import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import authMiddleware from '../middlewares/authMid.js'

const PORT = 8000;

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// configuração do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${req.user._id}_${Date.now()}${ext}`);
    }
});

const upload = multer({ storage });

const router = express.Router();

// rota para upload do avatar
router.post(
    "/upload/avatar",
    authMiddleware,
    upload.single("avatar"),
    async (req, res) => {
        try {
            const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

            await User.findByIdAndUpdate(req.user.id, {
                avatar: imageUrl
            });

            res.json({ avatarUrl: imageUrl });
        } catch (err) {
            res.status(500).json({ message: "Erro ao fazer upload do avatar." });
        }
    }
);

// rota para upload do header
router.post(
    "/upload/header",
    authMiddleware,
    upload.single("header"),
    async (req, res) => {
        try {
            const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

            await User.findByIdAndUpdate(req.user.id, {
                headerImg: imageUrl
            });

            res.json({ headerUrl: imageUrl });
        } catch (err) {
            res.status(500).json({ message: "Erro ao fazer upload da imagem de capa." });
        }
    }
);

export default router;