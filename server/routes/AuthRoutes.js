import express from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../models/UserModel.js'

import authMiddleware from '../middlewares/authMid.js'

const router = express.Router();

const JWT_SECRET = 'seu-segredo-super-secreto-123';

router.get("/validate", authMiddleware, async (req, res) =>{
    try {
        // Se o middleware 'authMiddleware' passou, significa que o token é válido.
        // req.user contém o ID do usuário decodificado do token.
        
        // Busca o usuário atualizado do banco de dados (sem a senha)
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        
        // Retorna o objeto do usuário.
        res.json({ user });

    } catch (error) {
        // Isso normalmente não é acionado, a menos que o banco falhe, 
        // pois a falha de token é tratada pelo middleware.
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

router.post('/register', async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    try {
        if (!firstName || !lastName || !username || !email || !password) {
            return res.status(400).json({ message: 'Preencha todos os campos.' });
        }

        // verifica se já existe username
        if (await User.findOne({ username })) {
            return res.status(400).json({ message: 'Nome de usuário já existe.' });
        }

        // verifica email duplicado
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'E-mail já cadastrado.' });
        }

        // criptografa senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // cria displayName combinando nome + sobrenome
        const displayName = `${firstName} ${lastName}`;

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            displayName
        });

        await newUser.save();

        res.status(201).json({ message: 'Usuário registrado com sucesso!' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user)
            return res.status(400).json({ message: 'Usuário ou senha inválidos.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Usuário ou senha inválidos.' });

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
            );

        res.json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;