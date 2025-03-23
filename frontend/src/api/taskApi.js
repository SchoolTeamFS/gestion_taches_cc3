import axios from "axios";

const API_URL = "http://localhost:5002/tache";


export const fetchTasks = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};


export const createTask = async (task, token) => {
  try {
    const response = await axios.post(`${API_URL}/`, task, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};


export const updateTask = async (id, updatedTask, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedTask, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};


export const assignTask = async (id, userId, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/assign`, { userId }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error assigning task:", error);
    throw error;
  }
};

export const updateTaskStatus = async (id, status, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/status`, { statut: status }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};


export const fetchComments = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/comments`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};


export const addComment = async (id, comment, token) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/comments`, comment, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};
