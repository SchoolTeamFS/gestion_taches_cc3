const express = require("express");
const router = express.Router();
const Message = require("../models/Message"); // Modèle de messages

// Route pour récupérer les messages d'un projet
router.get("/:projectId", async (req, res) => {
  try {
    const messages = await Message.find({ projectId: req.params.projectId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des messages.", error: error.message });
  }
});
router.get("/user-projects", async (req, res) => {
  try {
    const userId = req.user.id; // ID de l'utilisateur connecté depuis le token

    // Récupérer les projets où l'utilisateur est membre
    const projets = await Project.find({ membre: { $in: [userId] } });

    if (!projets.length) {
      return res.status(404).json({ message: "Aucun projet assigné trouvé." });
    }

    res.status(200).json(projets);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des projets.", error: error.message });
  }
});


// Route pour envoyer un message
router.post("/", async (req, res) => {
  try {
    const { projectId, sender, message } = req.body;

    if (!projectId || !sender || !message) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const newMessage = new Message({ projectId, sender, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'envoi du message.", error: error.message });
  }
});

module.exports = router;
