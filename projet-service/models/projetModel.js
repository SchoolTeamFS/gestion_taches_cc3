const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    nom: { type: String, required: true},
    description: { type: String },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    statut: { type: String, enum: ["En cours", "Terminé", "En attente", "Annulé"], default: "En attente" },
    categorie: { type: String, ref: 'Category', required: true },
    membre:[{ type: String }],
})

module.exports=mongoose.model("Project", projectSchema)
