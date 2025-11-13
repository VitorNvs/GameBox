// server.js
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose'; 

const app = express();
const PORT = 8000;
const JWT_SECRET = 'seu-segredo-super-secreto-123';

app.use(cors()); 
app.use(express.json()); 

// --- 1. CONEXÃO (Já está certa!) ---
const MONGO_URI = 'mongodb+srv://henryissues:thyerri123@cluster0.o0mpfp8.mongodb.net/gamebase-db?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB Atlas com sucesso!'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// --- 2. SCHEMAS (CORRIGIDOS) ---
const UserSchema = new mongoose.Schema({ /* ... (seu schema de User) ... */ });
const User = mongoose.model('User', UserSchema);

// Removi o campo "id" para usarmos o "_id" automático do MongoDB
const GameSchema = new mongoose.Schema({
    listType: { type: String },
    title: { type: String, required: true },
    rating: { type: String },
    price: { type: String },
    genre: { type: String },
    tags: [String], 
    description: { type: String },
    image: { type: String }
});
// O Mongoose vai procurar pela coleção 'jogos'
const Game = mongoose.model('jogos', GameSchema);

const ReviewSchema = new mongoose.Schema({
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'jogos' }, // Referencia o _id do Jogo
    username: { type: String },
    rating: { type: String }, 
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Review = mongoose.model('Review', ReviewSchema);

const ListSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    gamesCount: { type: Number, default: 0 },
    games: [GameSchema] 
});
const List = mongoose.model('List', ListSchema);

const AchievementSchema = new mongoose.Schema({ /* ... (seu schema de Achievement) ... */ });
const Achievement = mongoose.model('Achievement', AchievementSchema);

// --- Endpoints de JOGOS (AGORA 100% CORRIGIDOS) ---

// GET /jogos (listar todos ou por gênero)
app.get('/jogos', async (req, res) => {
    try {
        // ... (código de filtro, está correto) ...
        const categoryGenre = req.query.genre;
        let jogos;
        if (categoryGenre) {
            jogos = await Game.find({
                $or: [
                    { genre: { $regex: categoryGenre, $options: 'i' } },
                    { tags: { $regex: categoryGenre, $options: 'i' } }
                ]
            });
        } else {
            jogos = await Game.find();
        }
        console.log(`200 OK: Enviando ${jogos.length} jogos do MongoDB`);
        res.json(jogos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /jogos/:id (buscar jogo específico) - CORRIGIDO
app.get('/jogos/:id', async (req, res) => {
    try {
        // 1. Busca o jogo pelo _id
        const jogo = await Game.findById(req.params.id); 
        if (!jogo) return res.status(404).json({ message: 'Jogo não encontrado' });
        
        // 2. Busca as reviews que referenciam o _id do jogo
        const gameReviews = await Review.find({ gameId: req.params.id }); 
        
        console.log(`200 OK: Enviando jogo ${jogo.title} com ${gameReviews.length} reviews`);
        // 3. Combina o jogo com suas reviews e envia
        res.json({ ...jogo.toObject(), reviews: gameReviews }); 

    } catch (err) {
        console.error("Erro em GET /jogos/:id:", err.message);
        res.status(404).json({ message: 'Jogo não encontrado (ID inválido)' });
    }
});

// POST /jogos (criar novo jogo)
app.post('/jogos', async (req, res) => {
    const jogo = new Game({ ...req.body });
    try {
        const savedJogo = await jogo.save();
        console.log(`201, Created: Novo jogo salvo -> ${savedJogo.title}`);
        res.status(201).json(savedJogo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH /jogos/:id (atualizar jogo existente) - CORRIGIDO
app.patch('/jogos/:id', async (req, res) => {
    try {
        const updatedJogo = await Game.findByIdAndUpdate(
            req.params.id, // Busca pelo _id
            { $set: req.body },
            { new: true }
        );
        if (!updatedJogo) {
            return res.status(404).json({ message: 'Jogo não encontrado' });
        }
        console.log(`200 OK: Jogo atualizado -> ${updatedJogo.title}`);
        res.json(updatedJogo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /jogos/:id (remover jogo) - CORRIGIDO
app.delete('/jogos/:id', async (req, res) => {
    try {
        const deletedJogo = await Game.findByIdAndDelete(req.params.id); // Busca pelo _id
        if (!deletedJogo) {
            return res.status(404).json({ message: 'Jogo não encontrado' });
        }
        console.log(`200 OK: Jogo removido -> ${deletedJogo.title}`);
        res.json({ message: 'Jogo deletado com sucesso!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// --- Endpoints de REVIEWS (CRUD COMPLETO) ---
app.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().populate('gameId', 'title image');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /reviews/:id (busca uma review específica)
app.get('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('gameId', 'title image');
    if (!review) return res.status(404).json({ message: 'Review não encontrada' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /reviews (criar uma nova review)
app.post('/reviews', async (req, res) => {
  try {
    const { gameId, username, rating, text } = req.body;

    if (!gameId || !text) {
      return res.status(400).json({ message: 'gameId e texto são obrigatórios.' });
    }

    const newReview = new Review({ gameId, username, rating, text });
    const savedReview = await newReview.save();
    console.log(`201 Created: Nova review salva para o jogo ${gameId}`);
    res.status(201).json(savedReview);
  } catch (err) {
    console.error('Erro ao criar review:', err);
    res.status(500).json({ message: 'Erro ao salvar a review.' });
  }
});

// DELETE /reviews/:id
app.delete('/reviews/:id', async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Review não encontrada.' });
    res.json({ message: 'Review deletada com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
        if (await User.findOne({ username })) return res.status(400).json({ message: 'Nome de usuário já existe.' });
        if (await User.findOne({ email })) return res.status(400).json({ message: 'E-mail já cadastrado.' });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        console.log('Novo usuário registrado no MongoDB:', newUser.username);
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Usuário ou senha inválidos.' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Usuário ou senha inválidos.' });
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        console.log('Usuário logado:', user.username);
        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- Endpoints de LISTS (CRUD COMPLETO) ---
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
    const updatedList = await List.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedList);
});
app.delete('/lists/:id', async (req, res) => {
    await List.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// --- Endpoints de ACHIEVEMENTS (CRUD COMPLETO) ---
app.get('/achievements', async (req, res) => {
    const achievements = await Achievement.find();
    res.json(achievements);
}); // <-- GET /achievements TERMINA AQUI. CORRIGIDO!

// POST /achievements (Cria uma nova conquista) - AGORA DO LADO DE FORA
app.post('/achievements', async (req, res) => {
    const achievement = new Achievement({ ...req.body });
    const savedAchievement = await achievement.save();
    res.status(201).json(savedAchievement);
});

// PATCH /achievements/:id (Atualiza uma conquista) - AGORA DO LADO DE FORA
app.patch('/achievements/:id', async (req, res) => {
    const updatedAchievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAchievement);
});

// DELETE /achievements/:id (Deleta uma conquista) - AGORA DO LADO DE FORA
app.delete('/achievements/:id', async (req, res) => {
    await Achievement.findByIdAndDelete(req.params.id);
    res.status(204).send();
});


// --- Iniciar o Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor back-end REAL (com MongoDB) rodando em http://localhost:${PORT}`);
});