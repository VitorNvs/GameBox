/* eslint-disable no-irregular-whitespace */
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import './passportConfig.js';
import User from './models/User.js';

const JWT_SECRET = 'seu-segredo-super-secreto-123';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id).select('-password');
            if (!user) return done(null, false);
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    })
);

const app = express();
const PORT = 8000;

// 1. Configurar o CORS primeiro para todas as rotas
app.use(cors({
    origin: 'http://localhost:5173', // A porta do seu front-end (Vite)
    credentials: true
}));

// 2. Configurar os parsers do body (ESSENCIAL para req.body funcionar)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 3. Inicializar o Passport
app.use(passport.initialize());


const MONGO_URI =
    'mongodb+srv://henryissues:thyerri123@cluster0.o0mpfp8.mongodb.net/gamebase-db?retryWrites=true&w=majority';

mongoose
    .connect(MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB Atlas com sucesso!'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// -------------------- SCHEMAS --------------------

const GameSchema = new mongoose.Schema({
    listType: { type: String },
    title: { type: String, required: true },
    rating: { type: String },
    price: { type: String },
    genre: { type: String },
    tags: [String],
    description: { type: String },
    image: { type: String },
});

const Game = mongoose.model('jogos', GameSchema);

const ReviewSchema = new mongoose.Schema({
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'jogos' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String },
    rating: { type: String },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', ReviewSchema);

const ListSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    gamesCount: { type: Number, default: 0 },
    games: [GameSchema],
});

const List = mongoose.model('List', ListSchema);

// server.js (Substitua a linha 123)

const AchievementSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    rule: { 
        type: String 
    },
    icon: { 
        type: String 
    }
});

const Achievement = mongoose.model('Achievement', AchievementSchema);

const CategorieSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String    
    },
    imagem: {
        type: String
    },
    alt: { 
        type: String 
    },
    color: { 
        type: String 
    },
    id: {
        type: String
    }
});

const Categorie = mongoose.model('Categorie', CategorieSchema);


// -------------------- JOGOS --------------------

app.get('/jogos', async (req, res) => {
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

app.get('/jogos/:id', async (req, res) => {
    try {
        const jogo = await Game.findById(req.params.id);
        if (!jogo) return res.status(404).json({ message: 'Jogo não encontrado' });

        const gameReviews = await Review.find({ gameId: req.params.id });

        res.json({ ...jogo.toObject(), reviews: gameReviews });
    } catch (err) {
        res.status(404).json({ message: 'Jogo não encontrado (ID inválido)' });
    }
});

app.post('/jogos', async (req, res) => {
    const jogo = new Game({ ...req.body });
    try {
        const savedJogo = await jogo.save();
        res.status(201).json(savedJogo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.patch('/jogos/:id', async (req, res) => {
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

app.delete('/jogos/:id', async (req, res) => {
    try {
        const deletedJogo = await Game.findByIdAndDelete(req.params.id);
        if (!deletedJogo)
            return res.status(404).json({ message: 'Jogo não encontrado' });

        res.json({ message: 'Jogo deletado com sucesso!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// -------------------- REVIEWS --------------------

app.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().populate('gameId', 'title image');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/reviews/:id', async (req, res) => {
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
app.post('/reviews', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
app.get('/reviews/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.user.id })
            .populate('gameId')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar reviews.' });
    }
});

app.delete('/reviews/:id', async (req, res) => {
    try {
        const deleted = await Review.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: 'Review não encontrada.' });

        res.json({ message: 'Review deletada com sucesso!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// -------------------- AUTENTICAÇÃO --------------------

app.post('/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password)
            return res
                .status(400)
                .json({ message: 'Por favor, preencha todos os campos.' });

        if (await User.findOne({ username }))
            return res.status(400).json({ message: 'Nome de usuário já existe.' });

        if (await User.findOne({ email }))
            return res.status(400).json({ message: 'E-mail já cadastrado.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user)
            return res.status(400).json({ message: 'Usuário ou senha inválidos.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Usuário ou senha inválidos.' });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// -------------------- LISTAS --------------------

app.get('/lists', async (req, res) => {
    const lists = await List.find();
    res.json(lists);
});

app.post('/lists', async (req, res) => {
    const list = new List({ ...req.body });
    const savedList = await list.save();
    res.status(201).json(savedList);
});

app.patch('/lists/:id', async (req, res) => {
    const updatedList = await List.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updatedList);
});

app.delete('/lists/:id', async (req, res) => {
    await List.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// -------------------- ACHIEVEMENTS --------------------

app.get('/achievements', async (req, res) => {
    const achievements = await Achievement.find();
    res.json(achievements);
});

app.post('/achievements', async (req, res) => {
    const achievement = new Achievement({ ...req.body });
    const savedAchievement = await achievement.save();
    res.status(201).json(savedAchievement);
});

app.patch('/achievements/:id', async (req, res) => {
    const updatedAchievement = await Achievement.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updatedAchievement);
});

app.delete('/achievements/:id', async (req, res) => {
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
app.get('/perfil', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        const reviews = await Review.find({ userId: user._id })
            .populate('gameId')   // pega título, imagem e tudo do jogo
            .sort({ createdAt: -1 });

        res.json({
            user,
            reviews
        });

    } catch (err) {
        res.status(500).json({ message: 'Erro ao carregar dados do perfil.' });
    }
});
// -------------------- CATEGORIAS --------------------

app.post('/categories', async (req, res) => {
    try {
        const categorie = new Categorie({ ...req.body });
        const savedAchievement = await categorie.save();
        res.status(201).json(savedAchievement);   
    } catch (error) {
        
    } 
});

app.delete('/categories/:id', async (req, res) => {
    try {
        const deletedCategorie = await Categorie.findByIdAndDelete(req.params.id);
        
        if (!deletedCategorie) {
            // Se não encontrou o item, retorne um 404
            return res.status(404).json({ message: "Categoria não encontrada." });
        }
        
        // Sucesso, item deletado
        res.status(204).send();

    } catch (err) {
        // Erro de ID mal formatado ou outro erro de servidor
        res.status(500).json({ message: err.message });
    }
});

// -------------------- SERVIDOR --------------------

app.listen(PORT, () => {
    console.log(`Servidor back-end rodando em http://localhost:${PORT}`);
});
