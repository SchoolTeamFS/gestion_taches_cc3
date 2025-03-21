const express = require("express")
const Project = require("../models/projetModel")
const Category = require('../models/categoryModel')
const router = express.Router()

router.post("/category/add", async (req, res) => {
  try {
    const { nom } = req.body
    const existingCategory = await Category.findOne({ nom })
    if (existingCategory) {
      return res.status(400).json({ message: "La catégorie existe déjà" })
    }

    const newCategory = new Category({ nom })
    await newCategory.save()
    res.status(201).json(newCategory)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find()
    if (categories.length === 0) {
      return res.status(404).json({ message: "Aucune catégorie trouvée" })
    }
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message })
  }
})

router.post("/add", async (req, res) => {
  try {
    const { nom, description, dateDebut, dateFin, statut, categorieNom } = req.body
    const category = await Category.findOne({ nom: categorieNom })
    if (!category) return res.status(404).json({ message: "Catégorie non trouvée" })

    const newProject = new Project({
      nom,
      description,
      dateDebut,
      dateFin,
      statut,
      categorie: category.nom
    })

    await newProject.save()
    res.status(201).json(newProject)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get("/filter", async (req, res) => {
  try {
    const { nom, dateDebut, dateFin, statut } = req.query
    const filter = {}

    if (nom) {
      filter.nom = { $regex: nom, $options: "i" }
    }

    if (dateDebut) {
      filter.dateDebut = { $gte: new Date(dateDebut) }
    }

    if (dateFin) {
      filter.dateFin = { $lte: new Date(dateFin) }
    }

    if (statut) {
      filter.statut = statut
    }

    const projects = await Project.find(filter)

    if (projects.length === 0) {
      return res.status(404).json({ message: "Aucun projet trouvé avec ces critères" })
    }

    res.status(200).json(projects)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message })
  }
})

router.put("/update/:nom", async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { nom: req.params.nom },
      req.body,
      { new: true }
    )

    if (!project) return res.status(404).json({ message: "Projet non trouvé" })

    res.status(200).json(project)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete("/delete/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ message: "Projet non trouvé" })
    res.status(200).json({ message: "Projet supprimé avec succès" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
