import axios from 'axios'

const API_URL = 'http://localhost:5000/projet'

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`)
    return response.data
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories", error)
    throw error
  }
}

export const addCategory = async (categoryName) => {
  try {
    const response = await axios.post(`${API_URL}/category/add`, { nom: categoryName })
    return response.data
  } catch (error) {
    console.error("Erreur lors de l'ajout de la catégorie", error)
    throw error
  }
}
