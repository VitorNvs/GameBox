/* eslint-disable no-irregular-whitespace */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Rotas
import ListRoutes from './server/routes/ListRoutes.js'
import GameRoutes from './server/routes/GameRoutes.js' 
import ReviewRoutes from './server/routes/ReviewRoutes.js' 
import AchievementRoutes from './server/routes/AchievementRoutes.js'
import CategoryRoutes from './server/routes/CategoryRoutes.js'
import ProfileRoutes from './server/routes/ProfileRoutes.js'
import UploadRoutes from './server/routes/UploadRoutes.js'
import AuthRoutes from './server/routes/AuthRoutes.js'

/*
const JWT_SECRET = 'seu-segredo-super-secreto-123';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};


passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload._id).select('-password');
            if (!user) return done(null, false);
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    })
);
*/

export const app = express();
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
//app.use(passport.initialize());


const MONGO_URI =
    'mongodb+srv://henryissues:thyerri123@cluster0.o0mpfp8.mongodb.net/gamebase-db?retryWrites=true&w=majority';

mongoose
    .connect(MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB Atlas com sucesso!'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use("/lists", ListRoutes);
app.use("/jogos", GameRoutes);
app.use("/reviews", ReviewRoutes);
app.use("/achievements", AchievementRoutes);
app.use("/categories", CategoryRoutes);
app.use("/", ProfileRoutes);
app.use("/upload", UploadRoutes);
app.use("/auth", AuthRoutes);

// tornar uploads acessível publicamente
app.use("/uploads", express.static("uploads"));

// -------------------- SERVIDOR --------------------

app.listen(PORT, () => {
    console.log(`Servidor back-end rodando em http://localhost:${PORT}`);
});
