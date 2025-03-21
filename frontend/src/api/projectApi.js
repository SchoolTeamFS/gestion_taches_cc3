import axios from 'axios';

const API_URL = 'http://localhost:5001';  // Assurez-vous que le port du backend est correct

// Récupérer toutes les catégories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);  // Récupère les catégories
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories", error);
    throw error;
  }
};

// Récupérer les projets avec filtres
export const getProjects = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/filter`, { params: filters });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des projets", error);
    throw error;
  }
};

// Ajouter un projet
export const addProject = async (projectData) => {
  try {
    const response = await axios.post(`${API_URL}/add`, projectData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du projet", error);
    throw error;
  }
};
