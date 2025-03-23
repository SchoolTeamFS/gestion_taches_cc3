const express = require('express');
const Task = require('../models/Task');
const Comment = require('../models/Comment');
const router = express.Router();

// Créer une tâche
router.post('/', async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtenir toutes les tâches
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour une tâche
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer une tâche
router.delete('/:id', async (req, res) => {
  try {
    console.log('ID reçu :', req.params);
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    res.status(200).json({ message: 'Tâche supprimée', task });
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    res.status(500).json({ message: error.message });
  }
});

// Affecter une tâche à un utilisateur
router.put('/:id/assign', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    task.assignéÀ = req.body.userId; 
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Mettre à jour le statut d'une tâche
router.put('/:id/status', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    task.statut = req.body.statut; // Met à jour le statut
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Ajouter un commentaire
router.post('/:id/comments', async (req, res) => {
  try {
    const newComment = new Comment({
      taskId: req.params.id,
      auteur: req.body.auteur,
      contenu: req.body.contenu,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtenir les commentaires d'une tâche
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.id });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
