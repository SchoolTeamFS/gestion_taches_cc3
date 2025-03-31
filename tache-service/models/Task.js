const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },
  priorité: { type: String, enum: ['BASSE', 'MOYENNE', 'HAUTE'], required: true },
  deadline: { type: Date },
  statut: { type: String, enum: ['À FAIRE', 'EN COURS', 'TERMINÉ'], default: 'À FAIRE' },
  assignéÀ: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Task', taskSchema);