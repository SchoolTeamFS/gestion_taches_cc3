import React, { useEffect } from "react";
import { useTaskContext } from "../context/TaskContext";

const KanbanBoard = () => {
  const { tasks, fetchAllTasks, loading, error } = useTaskContext();

  useEffect(() => {
    fetchAllTasks(); 
  }, []);
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading tasks...</p>
      </div>
    );
  }

 
  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
        <p>{error}</p>
      </div>
    );
  }

 
  const tasksByStatus = {
    "À FAIRE": tasks.filter((task) => task.statut === "À FAIRE"),
    "EN COURS": tasks.filter((task) => task.statut === "EN COURS"),
    "TERMINÉ": tasks.filter((task) => task.statut === "TERMINÉ"),
  };

  const columnStyle = {
    width: "30%",
    padding: "10px",
    borderRadius: "8px",
    color: "#fff",
    margin: "0 10px",
  };

  const statusColors = {
    "À FAIRE": "#ff6f61", 
    "EN COURS": "#ffa500", 
    "TERMINÉ": "#4caf50", 
  };

  const taskStyle = {
    margin: "10px 0",
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#f4f4f4",
    color: "#333",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", margin: "20px 0", color: "#333" }}>Kanban Board</h2>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        {/* Column for "À FAIRE" tasks */}
        <div style={{ ...columnStyle, backgroundColor: statusColors["À FAIRE"] }}>
          <h3 style={{ textAlign: "center", marginBottom: "20px" }}>À FAIRE</h3>
          {tasksByStatus["À FAIRE"].length > 0 ? (
            tasksByStatus["À FAIRE"].map((task) => (
              <div key={task._id} style={taskStyle}>
                <h4>{task.titre}</h4>
                <p>{task.description}</p>
                <p>Priorité: {task.priorité}</p>
                <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline"}</p>
              </div>
            ))
          ) : (
            <p>No tasks in this column.</p>
          )}
        </div>

        {/* Column for "EN COURS" tasks */}
        <div style={{ ...columnStyle, backgroundColor: statusColors["EN COURS"] }}>
          <h3 style={{ textAlign: "center", marginBottom: "20px" }}>EN COURS</h3>
          {tasksByStatus["EN COURS"].length > 0 ? (
            tasksByStatus["EN COURS"].map((task) => (
              <div key={task._id} style={taskStyle}>
                <h4>{task.titre}</h4>
                <p>{task.description}</p>
                <p>Priorité: {task.priorité}</p>
                <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline"}</p>
              </div>
            ))
          ) : (
            <p>No tasks in this column.</p>
          )}
        </div>

        {/* Column for "TERMINÉ" tasks */}
        <div style={{ ...columnStyle, backgroundColor: statusColors["TERMINÉ"] }}>
          <h3 style={{ textAlign: "center", marginBottom: "20px" }}>TERMINÉ</h3>
          {tasksByStatus["TERMINÉ"].length > 0 ? (
            tasksByStatus["TERMINÉ"].map((task) => (
              <div key={task._id} style={taskStyle}>
                <h4>{task.titre}</h4>
                <p>{task.description}</p>
                <p>Priorité: {task.priorité}</p>
                <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline"}</p>
              </div>
            ))
          ) : (
            <p>No tasks in this column.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
