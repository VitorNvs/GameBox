import express from "express";

import Category from '../models/CategoryModel.js'

import authMiddleware from '../middlewares/authMid.js'
import adminMiddleware from '../middlewares/adminMid.js'

const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const novaCategoria = await Category.create(req.body);
        res.json(novaCategoria);
        //const category = new Category({ ...req.body });
        //const savedCategory = await category.save();
        //res.status(201).json(savedCategory);   
    } catch (error) {
        // Erro de ID mal formatado ou outro erro de servidor
        res.status(500).json({ message: err.message });
    } 
});

router.get('/', async (req, res) => {
    try{
        const category = await Category.find();
        res.json(category);
    }catch(error){
        res.json({ error: error.message });
    }
    
});

router.patch('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedCategory);
    } catch (error) {
        res.json({ error: error.message });
    }
    
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        
        if (!deletedCategory) {
            // Se não encontrou o item, retorne um 404
            return res.status(404).json({ message: "Categoria não encontrada." });
        }
        
        // Sucesso, item deletado
        res.json(deletedCategory);

    } catch (err) {
        // Erro de ID mal formatado ou outro erro de servidor
        res.status(500).json({ message: err.message });
    }
});

export default router;