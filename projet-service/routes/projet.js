const express = require("express")
const axios = require('axios')
const Project = require("../models/projetModel")
const Category = require('../models/categoryModel')
const isAdmin = require('../middleware/isAdmin')
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
router.put("/updateCategory/:id", async (req, res) => {
  try {
    const categorie = await Category.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    )
    if (!categorie) return res.status(404).json({ message: "Categorie non trouvé" })

    res.status(200).json(categorie)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})
router.delete("/deleteCategory/:id", async (req, res) => {
  try {
    const categorie = await Category.findByIdAndDelete(req.params.id)
    if (!categorie) return res.status(404).json({ message: "Categorie non trouvé" })
    res.status(200).json({ message: "Categorie supprimé avec succès" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
router.get("/all", async (req, res) => {
    try {
      const projets = await Project.find()
      if (projets.length === 0) {
        return res.status(404).json({ message: "projet introuvable" })
      }
      res.status(200).json(projets)
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

router.put("/update/:id", async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id },
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

router.post("/enroll/:user_id/:projet_id", isAdmin, async (req, res) => {
  try {
    const { user_id, projet_id } = req.params;
    console.log(`Attempting to enroll user ${user_id} in project ${projet_id}`);

    const userResponse = await axios.get(`http://localhost:5000/auth/${user_id}`, {
      headers: { Authorization: req.headers.authorization }
    });

    if (!userResponse.data) {
      return res.status(404).json({ message: "User not found" });
    }

    const projet = await Project.findById(projet_id);

    if (!projet) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (projet.membre.includes(user_id)) {
      return res.status(400).json({ message: "User is already enrolled in this project" });
    }

    projet.membre.push(user_id);
    await projet.save();

    console.log(`User ${userResponse.data.name} enrolled in project ${projet.nom}`);
    res.json({ message: `User ${userResponse.data.name} enrolled successfully`, user: userResponse.data });
  } catch (error) {
    console.error("Error enrolling user:", error.response?.data || error.message);
    res.status(500).json({ message: "Error enrolling user", error: error.message });
  }
});

  router.delete("/removeUser/:user_id/:projet_id", isAdmin, async (req, res) => {
    try {
      const { user_id, projet_id } = req.params;
      const userResponse = await axios.get(`http://localhost:5000/auth/${user_id}`, {
        headers: { Authorization: req.headers.authorization }
      });
      const project = await Project.findById(projet_id);

      if (!userResponse.data) {
        return res.status(404).json({ message: "User not found" });
      }
      const result = await Project.updateOne(
        { _id: projet_id }, 
        { $pull: { membre: user_id } } 
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "User or Project not found" });
      }
      res.json({ message: `User ${userResponse.data.name} removed from project ${project.nom}` });

    } catch (error) {
      console.error("Error removing user:", error);
      res.status(500).json({ message: "Error updating user enrollments", error });
    }
  });

module.exports = router
