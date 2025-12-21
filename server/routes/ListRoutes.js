import express from "express";

import List from '../models/ListModel.js'

import authMiddleware from '../middlewares/authMid.js'

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const lists = await List.find({ userId: req.user.id}).populate('games');
        //console.log(req.body);
        res.json(lists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, games } = req.body;
        // ...
        const gamesList = Array.isArray(games) ? games : []; // Garante que é um array
        
        const list = new List({
            userId: req.user.id,
            title: title.trim(),
            description: (description || '').trim(),
            games: gamesList,
            gamesCount: gamesList.length // --- ADICIONE ESTA LINHA ---
        });

        const saved = await list.save();
        const populated = await List.findById(saved.id).populate('games');
        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "ID inválido." });
        }

        const updateData = {};
        if (req.body.title !== undefined) updateData.title = req.body.title.trim();
        if (req.body.description !== undefined) updateData.description = req.body.description.trim();
        if (req.body.games !== undefined) {
            updateData.games = Array.isArray(req.body.games) ? req.body.games : [];
            updateData.gamesCount = updateData.games.length;
        }

        // PASSO 1: Atualiza o documento (sem se preocupar em popular aqui)
        const updatedList = await List.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            updateData,
            { new: true, runValidators: true } 
        );

        if (!updatedList) {
            return res.status(404).json({ message: "Lista não encontrada ou sem permissão." });
        }

        
        // PASSO 2: Busca o documento que acabamos de salvar pelo ID
        // PASSO 3: Popula o campo 'games' desse documento
        const populatedList = await List.findById(updatedList._id).populate('games');

        // PASSO 4: Envia o documento recém-buscado e 100% populado
        res.json(populatedList);
        // --- FIM DA MUDANÇA ---

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Remover um jogo da lista
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // Use req.params.id (sem o underscore)
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "ID inválido." });
        }

        // Use req.params.id (sem o underscore)
        const deleted = await List.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deleted) return res.status(404).json({ message: 'Lista não encontrada ou sem permissão.' });

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;