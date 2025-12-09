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
import multer from "multer";
import path from "path";
import fs from "fs";

const JWT_SECRET = 'seu-segredo-super-secreto-123';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};

const listSchema = new mongoose.Schema({
    // Referência ao usuário logado, essencial para segurança
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    // Armazena referências aos IDs dos jogos
    games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'jogos' }],
    gamesCount: { type: Number, default: 0 }, // (Assumindo que você corrigiu o 'ref' para 'jogos')
}, { timestamps: true });

// ...existing code...
// Transformação JSON para enviar "id" em vez de "_id" e remover __v
listSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
});

const List = mongoose.model('List', listSchema);

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

GameSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
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

const CategorySchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String    
    },
    image: {
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

const Category = mongoose.model('Category', CategorySchema);


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

// Jogo individual + reviews populadas
app.get('/jogos/:id', async (req, res) => {
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

const authMiddleware = (req, res, next) => {
    // 1. Obter o cabeçalho Authorization
    const authHeader = req.header('Authorization');

    // 2. Verificar se o cabeçalho existe e está no formato 'Bearer token'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Autenticação falhou: Token ausente ou formato inválido.');
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido ou inválido.' });
    }

    // 3. Extrair o token (removendo "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // 4. Verificar e decodificar o token
        // O método 'verify' lançará um erro se o token for inválido ou expirado.
        const decoded = jwt.verify(token, JWT_SECRET);

        // 5. Anexar os dados decodificados (payload) à requisição
        // Assumimos que o payload contém o ID do usuário (ex: { id: 'userID_123' })
        req.user = decoded;
        
        // 6. Prosseguir para o próximo manipulador de rota
        next();

    } catch (err) {
        // O token é inválido (expirado, assinado incorretamente, etc.)
        console.error('Verificação de token falhou:', err.message);
        return res.status(401).json({ message: 'Token inválido ou expirado. Acesso não autorizado.' });
    }
};

app.get("/auth/validate", authMiddleware, async (req, res) =>{
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

app.post('/auth/register', async (req, res) => {
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
            { id: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
            );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/auth/validate', requireAuth, async (req, res) => {
    // Se o middleware requireAuth passou, req.user já contém o payload do JWT ({id: '...'}).
    
    console.log("-----------------------------------------");
    console.log("Recebendo requisição /auth/validate...");
    console.log("Payload decodificado em req.user:", req.user); // req.user.id já está disponível
    console.log("-----------------------------------------");

    try {
        // Usa o ID injetado pelo middleware
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            console.error("DIAGNÓSTICO: Usuário do token não encontrado no DB:", req.user.id);
            // Embora o token seja válido, o usuário pode ter sido excluído.
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        console.log("DIAGNÓSTICO: Validação bem-sucedida. Retornando usuário.");
        return res.json({ message: "Acesso autorizado", user });

    } catch (dbError) {
        console.error("DIAGNÓSTICO: Erro ao buscar usuário no DB:", dbError.message);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});

// -------------------- LISTAS --------------------

app.get('/lists', authMiddleware, async (req, res) => {
    try {
        const lists = await List.find({ userId: req.user.id}).populate('games');
        //console.log(req.body);
        res.json(lists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/lists', authMiddleware, async (req, res) => {
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

app.patch('/lists/:id', authMiddleware, async (req, res) => {
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
app.delete('/lists/:id', authMiddleware, async (req, res) => {
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

app.get('/perfil', requireAuth, async (req, res) => {
    // req.user agora está disponível e contém {id: '...'} graças ao requireAuth
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
// -------------------- CATEGORIAS --------------------

app.post('/categories', async (req, res) => {
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

app.get('/categories', async (req, res) => {
    try{
        const category = await Category.find();
        res.json(category);
    }catch(error){
        res.json({ error: error.message });
    }
    
});

app.patch('/categories/:id', async (req, res) => {
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

app.delete('/categories/:id', async (req, res) => {
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

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// configuração do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${req.user.id}_${Date.now()}${ext}`);
    }
});

const upload = multer({ storage });

// rota para upload do avatar
app.post(
    "/upload/avatar",
    passport.authenticate('jwt', { session: false }),
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
app.post(
    "/upload/header",
    passport.authenticate('jwt', { session: false }),
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

app.get("/user/:id", async (req, res) => {
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



// tornar uploads acessível publicamente
app.use("/uploads", express.static("uploads"));

// -------------------- SERVIDOR --------------------

app.listen(PORT, () => {
    console.log(`Servidor back-end rodando em http://localhost:${PORT}`);
});
