// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  displayName: {
    type: String,
    default: function () {
      return this.username; // ✅ se não enviar, usa username
    },
  },

  role: { type: String, enum: ["user", "admin"], default: "user" },
  avatar: { type: String, default: "" },
  headerImg: { type: String, default: "" },

  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
