import express from "express";

import Achievement from '../models/AchievementModel.js'

import authMiddleware from '../middlewares/authMid.js'
import adminMiddleware from '../middlewares/adminMid.js'

const router = express.Router();

router.get('/', async (req, res) => {
    const achievements = await Achievement.find();
    res.json(achievements);
});

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const achievement = new Achievement({ ...req.body });
    const savedAchievement = await achievement.save();
    res.status(201).json(savedAchievement);
});

router.patch('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const updatedAchievement = await Achievement.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updatedAchievement);
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const deletedAchievement = await Achievement.findByIdAndDelete(req.params.id);
        
        if (!deletedAchievement) {
            // Se não encontrou o item, retorne um 404
            return res.status(404).json({ message: "Conquista não encontrada." });
        }
        
        // Sucesso, item deletado
        res.status(204).send();

    } catch (err) {
        // Erro de ID mal formatado ou outro erro de servidor
        res.status(500).json({ message: err.message });
    }
});

export default router;