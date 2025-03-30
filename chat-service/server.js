const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors());


mongoose.connect("mongodb://localhost:27017/chatdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

const MessageSchema = new mongoose.Schema({
  senderName: String,
  content: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", MessageSchema);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on("connection", (socket) => {
  console.log("🔌 Nouvelle connexion:", socket.id);

  // Charger les anciens messages
  Message.find().sort({ timestamp: 1 }).then((msgs) => {
    socket.emit("loadMessages", msgs);
  });

  socket.on("message", async ({ senderName, content }) => {
    if (!senderName || !content) return;
    
    const newMessage = new Message({ senderName, content });
    await newMessage.save();
    
    io.emit("message", newMessage); 
});


  socket.on("disconnect", () => {
    console.log("❌ Utilisateur déconnecté");
  });
});

server.listen(5005, () => console.log("🚀 Chat-service démarré sur le port 5005"));
