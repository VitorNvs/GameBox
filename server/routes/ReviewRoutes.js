import express from "express";

import Review from '../models/ReviewModel.js'

import authMiddleware from '../middlewares/authMid.js'

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find().populate('gameId', 'title image');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate(
            'gameId',
            'title image'
        );
        if (!review)
            return res.status(404).json({ message: 'Review não encontrada' });

        res.json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Criar uma review
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { gameId, rating, text } = req.body;
        const userId = req.user.id;
        const username = req.user.username;

        const review = new Review({
            gameId,
            rating,
            text,
            username,
            userId,
        });

        const saved = await review.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar review.' });
    }
});

// Reviews do usuário logado
router.get('/me', authMiddleware, async (req, res) => {
    try {
        
        const reviews = await Review.find({ userId: req.user.id })
            .populate('gameId')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar reviews.' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const review = await Review.findById(req.params.id);
        const reviewUser = review.userId.toString();
        if(reviewUser !== userId){
            return res.status(404).json({ message: 'Um usuário só pode apagar suas próprias reviews!' });
        } 
        const deleted = await Review.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: 'Review não encontrada.' });

        res.json({ message: 'Review deletada com sucesso!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;