import axios from "axios";
 
const API_URL = "http://localhost:5002/tache";
//var ac_token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjdkYzQ1ZTUyY2UyYjdiODBiMWI4OWEyIiwibmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoibWVtYnJlIn0sImlhdCI6MTc0MjQ4OTA2NiwiZXhwIjoxNzQzMDkzODY2fQ.nnpxpIh1178eoI0p-gpfGTUsfVn9gUZobOvdtNJtSK0"
export const fetchTasks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};
 
 
export const createTask = async (task, token) => {
  try {
    const response = await axios.post(API_URL, task, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};
 
export const updateTask = async (id, updatedTask) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedTask, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};
 
export const deleteTask = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
export const assignTaskToProject = async (taskId, projectId, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/${taskId}/assign-project`,
      { projetId: projectId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error assigning task to project:", error);
    throw error;
  }
};
 
export const updateTaskStatus = async (id, status, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}/status`,
      { statut: status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};
export const addCommentToTask = async (taskId, commentData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/${taskId}/comments`,
      {
        auteur: commentData.auteur,
        contenu: commentData.contenu,
        date: new Date()
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};
 
 
export const fetchCommentsForTask = async (taskId) => {
  try {
    const response = await axios.get(`${API_URL}/${taskId}/comments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};