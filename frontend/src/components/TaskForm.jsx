import React, { useState } from "react";
import { useTaskContext } from "../context/TaskContext";

const TaskForm = () => {
  const { addNewTask, error } = useTaskContext();
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [priorité, setPriorité] = useState("MOYENNE"); 
  const [deadline, setDeadline] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      titre, 
      description,
      priorité,
      deadline,
    };

    try {
      await addNewTask(newTask); 
      setSuccess("Task created successfully!");
      setTitre("");
      setDescription("");
      setPriorité("MOYENNE"); 
      setDeadline("");
      setTimeout(() => setSuccess(""), 3000); 
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  return (
    <div>
      <h2>Add Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="titre">Titre:</label>
          <input
            type="text"
            id="titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task details"
          />
        </div>

        <div>
          <label htmlFor="priorité">Priorité:</label>
          <select
            id="priorité"
            value={priorité}
            onChange={(e) => setPriorité(e.target.value)}
            required
          >
            <option value="BASSE">BASSE</option>
            <option value="MOYENNE">MOYENNE</option>
            <option value="HAUTE">HAUTE</option>
          </select>
        </div>

        <div>
          <label htmlFor="deadline">Deadline:</label>
          <input
            type="datetime-local"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <button type="submit">Add Task</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default TaskForm;
