// server.js
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose'; // <-- IMPORTA O MONGOOSE

const app = express();
const PORT = 8000;
const JWT_SECRET = 'seu-segredo-super-secreto-123';

app.use(cors()); 
app.use(express.json()); 

// --- CONEXÃO COM O MONGODB ATLAS ---
// Lembre-se de colocar sua SENHA e o NOME DO BANCO (gamebase-db) corretos!
const MONGO_URI = 'mongodb+srv://henryissues:thyerri123@cluster0.o0mpfp8.mongodb.net/gamebase-db?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB Atlas com sucesso!'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// --- DEFINIÇÃO DOS "MODELOS" (Schemas) ---

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

// --- MUDANÇA AQUI: O SCHEMA CORRETO PARA OS SEUS DADOS ---
const GameSchema = new mongoose.Schema({
    id: { type: String }, // O ID do seu JSON
    listType: { type: String },
    title: { type: String, required: true },
    rating: { type: String },
    price: { type: String },
    genre: { type: String },
    tags: [String], // <-- Um array de Strings
    description: { type: String },
    image: { type: String }
});
// O Mongoose vai procurar pela coleção "games" (plural de "Game")
const Game = mongoose.model('jogos', GameSchema);
// --- FIM DA MUDANÇA ---


// (Você precisará criar os Schemas para Lists, Reviews, etc., também)


// --- REESCREVENDO OS ENDPOINTS (O "Cardápio") ---

// --- Endpoints de GAMES (AGORA USANDO MONGODB) ---

// --- Endpoints de JOGOS (usando MongoDB) ---

// GET /jogos (listar todos ou por gênero)
app.get('/jogos', async (req, res) => {
    try {
        const categoryGenre = req.query.genre; // o front-end ainda pode mandar ?genre=Ação
        let jogos;
        if (categoryGenre) {
            jogos = await Game.find({
                $or: [
                    { genre: { $regex: categoryGenre, $options: 'i' } },
                    { tags: { $regex: categoryGenre, $options: 'i' } }
                ]
            });
            console.log('Filtro ativo: ${jogos.length} jogos encontrados');
        } else {
            jogos = await Game.find();
            console.log('200 OK: Enviando ${jogos.length} jogos do MongoDB');
        }
        res.json(jogos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /jogos/:id (buscar jogo específico)
app.get('/jogos/:id', async (req, res) => {
    try {
        const jogo = await Game.findOne({ id: req.params.id });
        if (!jogo) return res.status(404).json({ message: 'Jogo não encontrado' });
        res.json(jogo);
    } catch (err) {
        res.status(404).json({ message: 'Jogo não encontrado (ID inválido)' });
    }
});

// POST /jogos (criar novo jogo)
app.post('/jogos', async (req, res) => {
    const jogo = new Game({ ...req.body });
    try {
        const savedJogo = await jogo.save();
        console.log('201, Created: Novo jogo salvo → ${savedJogo.title}');
        res.status(201).json(savedJogo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH /jogos/:id (atualizar jogo existente)
app.patch('/jogos/:id', async (req, res) => {
    try {
        const updatedJogo = await Game.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true }
        );
        if (!updatedJogo) {
            return res.status(404).json({ message: 'Jogo não encontrado' });
        }
        console.log('200 OK: Jogo atualizado → ${updatedJogo.title}');
        res.json(updatedJogo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /jogos/:id (remover jogo)
app.delete('/jogos/:id', async (req, res) => {
    try {
        const deletedJogo = await Game.findOneAndDelete({ id: req.params.id });
        if (!deletedJogo) {
            return res.status(404).json({ message: 'Jogo não encontrado' });
        }
        console.log("200 OK: Jogo removido → ${deletedJogo.title}");
        res.json({ message: 'Jogo deletado com sucesso!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// (Você precisará reescrever PATCH /games/:id e DELETE /games/:id usando Mongoose)


// --- Endpoints de AUTENTICAÇÃO (AGORA USANDO MONGODB) ---

// POST /auth/register
app.post('/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
        
        if (await User.findOne({ username })) return res.status(400).json({ message: 'Nome de usuário já existe.' });
        if (await User.findOne({ email })) return res.status(400).json({ message: 'E-mail já cadastrado.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save(); // Salva o novo usuário no MongoDB
        
        console.log('Novo usuário registrado no MongoDB:', newUser.username);
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /auth/login
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username }); // Acha o usuário NO BANCO
        if (!user) return res.status(400).json({ message: 'Usuário ou senha inválidos.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Usuário ou senha inválidos.' });

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        
        console.log('Usuário logado:', user.username);
        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// (Você precisará reescrever os endpoints de Lists, Reviews, Achievements da mesma forma)

// --- Iniciar o Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor back-end REAL (com MongoDB) rodando em http://localhost:${PORT}`);
});