// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // Autorise le frontend
//     methods: ["GET", "POST"]
//   }
// });

// app.use(express.json());
// app.use(cors());

// const chats = {}; // Stockage temporaire des discussions (remplacer par une BD)

// app.get('/chat/:id', (req, res) => {
//   const { id } = req.params;
//   if (!chats[id]) {
//     chats[id] = { messages: [] }; // Initialise si non trouvé
//   }
//   res.json(chats[id]);
// });

// app.post('/chat/:id/messages', (req, res) => {
//   const { id } = req.params;
//   const { text, senderName } = req.body;

//   if (!chats[id]) {
//     chats[id] = { messages: [] };
//   }

//   const newMessage = { text, senderName, timestamp: new Date() };
//   chats[id].messages.push(newMessage);

//   io.to(id).emit('message', newMessage); // Envoie le message aux utilisateurs connectés

//   res.status(201).json(newMessage);
// });

// // WebSocket pour la communication en temps réel
// io.on('connection', (socket) => {
//   console.log('Nouvelle connexion WebSocket');

//   socket.on('join', (chatId) => {
//     socket.join(chatId);
//     console.log(`Utilisateur rejoint la salle : ${chatId}`);
//   });

//   socket.on('sendMessage', (chatId, message) => {
//     if (!chats[chatId]) {
//       chats[chatId] = { messages: [] };
//     }

//     chats[chatId].messages.push(message);
//     io.to(chatId).emit('message', message);
//   });

//   socket.on('disconnect', () => {
//     console.log('Utilisateur déconnecté');
//   });
// });

// server.listen(5005, () => {
//   console.log('Serveur démarré sur http://localhost:5005');
// });


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
