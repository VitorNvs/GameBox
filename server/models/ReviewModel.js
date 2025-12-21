import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'jogos' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String },
    rating: { type: String },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', ReviewSchema);
export default Review;