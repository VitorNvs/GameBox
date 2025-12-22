import mongoose from "mongoose";

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
export default Game;