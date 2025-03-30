import React, { createContext, useState, useContext } from "react";
import axios from "axios";


const TaskContext = createContext();


export const useTaskContext = () => {
  return useContext(TaskContext);
};


export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Récupérer toutes les tâches
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:5002/tache", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  // Ajouter une nouvelle tâche
  const addTask = async (newTask) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:5002/tache",
        newTask,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks((prevTasks) => [...prevTasks, response.data.task]); 
    } catch (err) {
      setError("Failed to create task");
    }
  };

  return (
    <TaskContext.Provider
      value={{ tasks, loading, error, fetchTasks, addTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};
