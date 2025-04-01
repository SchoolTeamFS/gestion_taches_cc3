// const express = require("express");
// const router = express.Router();
// const Message = require("../models/Message"); // Modèle de messages

// // Route pour récupérer les messages d'un projet
// router.get("/:projectId", async (req, res) => {
//   try {
//     const messages = await Message.find({ projectId: req.params.projectId }).sort({ timestamp: 1 });
//     res.status(200).json(messages);
//   } catch (error) {
//     res.status(500).json({ message: "Erreur lors de la récupération des messages.", error: error.message });
//   }
// });
// router.get("/user-projects", async (req, res) => {
//   try {
//     const userId = req.user.id; // ID de l'utilisateur connecté depuis le token

//     // Récupérer les projets où l'utilisateur est membre
//     const projets = await Project.find({ membre: { $in: [userId] } });

//     if (!projets.length) {
//       return res.status(404).json({ message: "Aucun projet assigné trouvé." });
//     }

//     res.status(200).json(projets);
//   } catch (error) {
//     res.status(500).json({ message: "Erreur lors de la récupération des projets.", error: error.message });
//   }
// });


// // Route pour envoyer un message
// router.post("/", async (req, res) => {
//   try {
//     const { projectId, sender, message } = req.body;

//     if (!projectId || !sender || !message) {
//       return res.status(400).json({ message: "Tous les champs sont requis." });
//     }

//     const newMessage = new Message({ projectId, sender, message });
//     await newMessage.save();
//     res.status(201).json(newMessage);
//   } catch (error) {
//     res.status(500).json({ message: "Erreur lors de l'envoi du message.", error: error.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');  // Assurez-vous que le modèle Chat est importé

// Récupérer les informations d'un chat spécifique par son ID
router.get('/chat/:id', async (req, res) => {
  const chatId = req.params.id;

  try {
    const chat = await Chat.findById(chatId).populate('users', 'name');  // Populate pour récupérer les utilisateurs
    if (!chat) {
      return res.status(404).send('Chat non trouvé');
    }
    res.json(chat);
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération du chat');
  }
});

// Envoyer un nouveau message dans un chat
router.post('/chat/:id/messages', async (req, res) => {
  const chatId = req.params.id;
  const { text, sender } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).send('Chat non trouvé');
    }

    const newMessage = { text, sender, timestamp: new Date() };
    chat.messages.push(newMessage);

    await chat.save();

    res.json(newMessage);  // Retourner le message nouvellement créé
  } catch (error) {
    res.status(500).send('Erreur lors de l\'enregistrement du message');
  }
});

module.exports = router;
