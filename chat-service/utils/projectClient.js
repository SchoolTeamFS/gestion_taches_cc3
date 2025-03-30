const axios = require("axios");

const projectApi = axios.create({
  baseURL: process.env.PROJECT_API_URL || "http://localhost:5001/api/projects",
});

const fetchProjectById = async (projectId, token) => {
  try {
    const response = await projectApi.get(`/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors de la récupération du projet");
  }
};

const isUserInProject = async (projectId, userId, token) => {
  try {
    const project = await fetchProjectById(projectId, token);
    return project.membre.includes(userId);
  } catch (error) {
    throw new Error("Erreur lors de la vérification de l'utilisateur dans le projet");
  }
};

module.exports = { fetchProjectById, isUserInProject };
