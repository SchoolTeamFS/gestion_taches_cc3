import React, { useState, useEffect } from "react";
import { useTaskContext } from "../context/TaskContext";

const TaskForm = () => {
  const { addTask, error, tasks } = useTaskContext();
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [priorité, setPriorité] = useState("MOYENNE");
  const [deadline, setDeadline] = useState("");
  const [statut, setStatut] = useState("À FAIRE");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (tasks.length > 0) {
      setSuccess("Task created successfully!");
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [tasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      titre,
      description,
      priorité,
      deadline,
      statut,
    };

    addTask(newTask);
    setTitre("");
    setDescription("");
    setPriorité("MOYENNE");
    setDeadline("");
    setStatut("À FAIRE");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add Task</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="titre" style={styles.label}>Titre:</label>
          <input
            type="text"
            id="titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="description" style={styles.label}>Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task details"
            style={{ ...styles.input, height: "80px" }}
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="priorité" style={styles.label}>Priorité:</label>
          <select
            id="priorité"
            value={priorité}
            onChange={(e) => setPriorité(e.target.value)}
            style={styles.select}
            required
          >
            <option value="BASSE">BASSE</option>
            <option value="MOYENNE">MOYENNE</option>
            <option value="HAUTE">HAUTE</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="statut" style={styles.label}>Statut:</label>
          <select
            id="statut"
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            style={styles.select}
          >
            <option value="À FAIRE">À FAIRE</option>
            <option value="EN COURS">EN COURS</option>
            <option value="TERMINÉ">TERMINÉ</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="deadline" style={styles.label}>Deadline:</label>
          <input
            type="datetime-local"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>Add Task</button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    color: "#333333",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontSize: "14px",
    color: "#666666", 
  },
  input: {
    width: "96%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #cccccc", 
    backgroundColor: "#ffffff", 
    color: "#333333",
  },
  select:{
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #cccccc", 
    backgroundColor: "#ffffff", 
    color: "#333333",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    color: "#ffffff",
    backgroundColor: "#333333", 
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  error: {
    color: "#ff0000", 
    textAlign: "center",
  },
  success: {
    color: "#00cc44", 
    textAlign: "center",
  },
};

export default TaskForm;