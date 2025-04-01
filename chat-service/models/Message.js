// const mongoose = require("mongoose");

// const MessageSchema = new mongoose.Schema(
//   {
//     sender: { type: String, required: true }, // ID ou nom de l'utilisateur
//     content: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Message", MessageSchema);


const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [messageSchema],  // Liste des messages dans le chat
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
