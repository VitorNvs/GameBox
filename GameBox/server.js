// server.js
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import './passportConfig.js';
import User from './models/User.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const JWT_SECRET = 'seu-segredo-super-secreto-123';
const PORT = 8000;

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

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

const MONGO_URI =
  'mongodb+srv://henryissues:thyerri123@cluster0.o0mpfp8.mongodb.net/gamebase-db?retryWrites=true&w=majority';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB Atlas com sucesso!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// ---------------- SCHEMAS ----------------

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
GameSchema.set('toJSON', { virtuals: true, versionKey: false });
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
  title: { type: String, required: true },
  description: { type: String, required: true },
  rule: { type: String },
  icon: { type: String },
});
const Achievement = mongoose.model('Achievement', AchievementSchema);

// IMPORTANT: Keep existing DB fields (games, gamesCount) but expose jogos/jogosCount in API
const listSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },

    // Keep original fields for DB compatibility:
    games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'jogos' }],
    gamesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Virtuals to expose jogos and jogosCount to clients
listSchema.virtual('jogos').get(function () {
  return this.games;
});
listSchema.virtual('jogosCount').get(function () {
  return this.gamesCount;
});

listSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    // remove internal mongo fields if you want (ret._id already mapped as id if needed)
    // keep games/gamesCount too if desired, but ensure frontend uses jogos/jogosCount
    return ret;
  },
});

const List = mongoose.model('List', listSchema);

// ---------------- ROUTES ---------------- //

// JOGOS
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

    const gameReviews = await Review.find({ gameId: req.params.id }).populate(
      'userId',
      'username avatar _id'
    );

    res.json({ ...jogo.toObject(), reviews: gameReviews });
  } catch (err) {
    res.status(404).json({ message: 'Jogo não encontrado (ID inválido)' });
  }
});

app.post('/jogos', async (req, res) => {
  try {
    const jogo = new Game({ ...req.body });
    const savedJogo = await jogo.save();
    res.status(201).json(savedJogo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// REVIEWS
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
    const review = await Review.findById(req.params.id).populate('gameId', 'title image');
    if (!review) return res.status(404).json({ message: 'Review não encontrada' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/reviews', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { gameId, rating, text } = req.body;
    const userId = req.user.id;
    const username = req.user.username;

    const review = new Review({ gameId, rating, text, username, userId });
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar review.' });
  }
});

app.get(
  '/reviews/me',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const reviews = await Review.find({ userId: req.user.id }).populate('gameId').sort({ createdAt: -1 });
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar reviews.' });
    }
  }
);

// AUTH
app.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });

    if (await User.findOne({ username })) return res.status(400).json({ message: 'Nome de usuário já existe.' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'E-mail já cadastrado.' });

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
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Usuário ou senha inválidos.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Usuário ou senha inválidos.' });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- LISTS (compatível com games/gamesCount no DB, expõe jogos/jogosCount) ----------------

// Helper to normalize incoming body: accept `jogos` or `games`
function extractGamesFromBody(body) {
  if (!body) return [];
  if (Array.isArray(body.jogos)) return body.jogos;
  if (Array.isArray(body.games)) return body.games;
  return [];
}

app.get('/lists', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const lists = await List.find({ userId: req.user._id }).populate('games');
    // normalize response: add jogos & jogosCount based on games
    const mapped = lists.map((l) => {
      const obj = l.toObject();
      obj.jogos = obj.games || [];
      obj.jogosCount = obj.gamesCount || (obj.games ? obj.games.length : 0);
      return obj;
    });
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/lists', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { title, description } = req.body;
    const jogosFromBody = extractGamesFromBody(req.body); // array of IDs expected

    const gamesList = Array.isArray(jogosFromBody) ? jogosFromBody : [];

    const list = new List({
      userId: req.user._id,
      title: title ? title.trim() : '',
      description: description ? description.trim() : '',
      games: gamesList,
      gamesCount: gamesList.length,
    });

    const saved = await list.save();
    const populated = await List.findById(saved._id).populate('games');

    const obj = populated.toObject();
    obj.jogos = obj.games || [];
    obj.jogosCount = obj.gamesCount || (obj.games ? obj.games.length : 0);

    res.status(201).json(obj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/lists/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ message: 'ID inválido.' });

    const updateData = {};
    if (req.body.title !== undefined) updateData.title = req.body.title.trim();
    if (req.body.description !== undefined) updateData.description = req.body.description.trim();

    const jogosFromBody = extractGamesFromBody(req.body);
    if (jogosFromBody !== undefined) {
      updateData.games = Array.isArray(jogosFromBody) ? jogosFromBody : [];
      updateData.gamesCount = updateData.games.length;
    }

    const updatedList = await List.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedList) return res.status(404).json({ message: 'Lista não encontrada ou sem permissão.' });

    const populatedList = await List.findById(updatedList._id).populate('games');
    const obj = populatedList.toObject();
    obj.jogos = obj.games || [];
    obj.jogosCount = obj.gamesCount || (obj.games ? obj.games.length : 0);
    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/lists/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ message: 'ID inválido.' });

    const deleted = await List.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Lista não encontrada ou sem permissão.' });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ACHIEVEMENTS
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
  const updatedAchievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedAchievement);
});
app.delete('/achievements/:id', async (req, res) => {
  try {
    const deletedAchievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!deletedAchievement) return res.status(404).json({ message: 'Conquista não encontrada.' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PERFIL
app.get('/perfil', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    const reviews = await Review.find({ userId: user._id }).populate('gameId').sort({ createdAt: -1 });

    res.json({ user, reviews });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao carregar dados do perfil.' });
  }
});

// UPLOADS
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

app.post('/upload/avatar', passport.authenticate('jwt', { session: false }), upload.single('avatar'), async (req, res) => {
  try {
    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user.id, { avatar: imageUrl });
    res.json({ avatarUrl: imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao fazer upload do avatar.' });
  }
});

app.post('/upload/header', passport.authenticate('jwt', { session: false }), upload.single('header'), async (req, res) => {
  try {
    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user.id, { headerImg: imageUrl });
    res.json({ headerUrl: imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao fazer upload da imagem de capa.' });
  }
});

app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('username avatar headerImg bio');
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const reviewCount = await Review.countDocuments({ userId: req.params.id });
    res.json({ ...user.toObject(), reviewCount });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao carregar mini perfil' });
  }
});

app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`Servidor back-end rodando em http://localhost:${PORT}`);
});
