import express from "express";

import User from '../models/UserModel.js'
import Review from '../models/ReviewModel.js'

import authMiddleware from '../middlewares/authMid.js'

const router = express.Router();

router.get('/perfil', authMiddleware, async (req, res) => {
    try {
        // Busca o usuário usando o ID injetado pelo middleware
        let user = await User.findById(req.user.id).select('-password');

        if (!user) {
             // Esta checagem é importante caso o middleware não tenha feito uma checagem completa no DB
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Se displayName não existir, criar automaticamente
        if (!user.displayName) {
            const first = user.firstName || "";
            const last = user.lastName || "";
            user.displayName = `${first} ${last}`.trim();
        }

        // Assumindo que Review está disponível no escopo
        const reviews = await Review.find({ userId: user._id })
            .populate('gameId')
            .sort({ createdAt: -1 });

        res.json({
            user,
            reviews
        });

    } catch (err) {
        // Retorna 500 para erros de DB ou lógica interna (exclui erros 401/403 que são tratados pelo middleware)
        console.error('Erro ao carregar dados do perfil:', err.message);
        res.status(500).json({ message: 'Erro ao carregar dados do perfil.' });
    }
});

router.get("/user/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("username avatar headerImg followers following");

        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

        const reviewsCount = await Review.countDocuments({ userId: req.params.id });

        res.json({
            ...user.toObject(),
            followersCount: user.followers.length,
            followingCount: user.following.length,
            reviewsCount
        });

    } catch (err) {
        res.status(500).json({ message: "Erro ao carregar mini perfil" });
    }
});

export default router;
