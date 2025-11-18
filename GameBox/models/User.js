// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, default: 'user' },
  createdAt:{ type: Date, default: Date.now },

  avatar: { type: String, default: "" },
  headerImg: { type: String, default: "" },

  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});


// registra e exporta o model
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;