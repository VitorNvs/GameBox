import mongoose from "mongoose";

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
export default List;