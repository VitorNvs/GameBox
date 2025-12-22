import express from "express";

import Game from '../models/GameModel.js'
import Review from '../models/ReviewModel.js'

import authMiddleware from '../middlewares/authMid.js'
import adminMiddleware from '../middlewares/adminMid.js'

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const categoryGenre = req.query.genre;
        let jogos;

        if (categoryGenre) {
            jogos = await Game.find({
                $or: [
                    { genre: { $regex: categoryGenre, $options: 'i' } },
                    { tags: { $regex: categoryGenre, $options: 'i' } },
                ],
            });
        } else {
            jogos = await Game.find();
        }

        res.json(jogos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Jogo individual + reviews populadas
router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({ message: "Jogo não encontrado" });
        }

        // buscar reviews desse jogo
        const reviews = await Review.find({ gameId: req.params.id })
            .populate("userId", "username avatar headerImg followers following") // <- importante!
            .sort({ createdAt: -1 });

        res.json({
            ...game.toObject(),
            reviews
        });

    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar jogo" });
    }
});

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const jogo = new Game({ ...req.body });
    try {
        const savedJogo = await jogo.save();
        res.status(201).json(savedJogo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const updatedJogo = await Game.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedJogo) return res.status(404).json({ message: 'Jogo não encontrado' });

        res.json(updatedJogo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const deletedJogo = await Game.findByIdAndDelete(req.params.id);
        if (!deletedJogo)
            return res.status(404).json({ message: 'Jogo não encontrado' });

        res.json({ message: 'Jogo deletado com sucesso!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
