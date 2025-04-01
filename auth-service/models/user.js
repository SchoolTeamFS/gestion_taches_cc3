const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema( {
    name: { type: String, required: [true, "Username is required"], unique: true },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, match: [
      /^\S+@\S+\.\S+$/, 
      "Please use a valid email address"
      ]},
    password: { type: String, required: [true, "Password is required"], minlength: 6, },
    role: { type: String, enum: ["membre", "admin", "invite"], default: "admin" },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
