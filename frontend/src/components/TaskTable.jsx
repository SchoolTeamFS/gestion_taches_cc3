import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTaskContext } from "../context/TaskContext";
import { updateTask, deleteTask, addCommentToTask } from "../api/taskApi";

const TaskTable = () => {
  const { tasks, fetchTasks, loading, error } = useTaskContext();
  const [editTaskId, setEditTaskId] = useState(null);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    priorité: "MOYENNE",
    deadline: "",
    statut: "À FAIRE",
  });
  const [commentInputs, setCommentInputs] = useState({});
  const navigate = useNavigate();

  const navigateToAddTask = () => {
    navigate("/taches/add");
  };
  const navigateToKanban = () => {
    navigate("/taches/kanban");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEdit = (task) => {
    setEditTaskId(task._id);
    setFormData({
      titre: task.titre,
      description: task.description,
      priorité: task.priorité,
      deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "",
      statut: task.statut,
    });
  };

  const handleSave = async () => {
    try {
      await updateTask(editTaskId, formData);
      fetchTasks();
      setEditTaskId(null);
      setFormData({
        titre: "",
        description: "",
        priorité: "MOYENNE",
        deadline: "",
        statut: "À FAIRE",
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditTaskId(null);
    setFormData({
      titre: "",
      description: "",
      priorité: "MOYENNE",
      deadline: "",
      statut: "À FAIRE",
    });
  };

  const handleCommentChange = (taskId, value) => {
    setCommentInputs(prev => ({
      ...prev,
      [taskId]: value
    }));
  };

  const handleAddComment = async (taskId) => {
    try {
      const token = "yourAuthToken";
      await addCommentToTask(
        taskId, 
        { 
          auteur: "User", 
          contenu: commentInputs[taskId] || "" 
        }, 
        token
      );
      setCommentInputs(prev => ({
        ...prev,
        [taskId]: ""
      }));
      fetchTasks();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Task Table</h2>
      <div>
        <button onClick={navigateToAddTask} style={styles.addButton}>
          Add Task
        </button>

        <span onClick={navigateToKanban} style={styles.backArrow}>
          ← Back to Kanban Board
        </span>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>Titre</th>
            <th style={styles.header}>Description</th>
            <th style={styles.header}>Priorité</th>
            <th style={styles.header}>Deadline</th>
            <th style={styles.header}>Statut</th>
            <th style={styles.header}>Actions</th>
            <th style={styles.header}>Comments</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td style={styles.cell}>
                {editTaskId === task._id ? (
                  <input
                    type="text"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  />
                ) : (
                  task.titre
                )}
              </td>
              <td style={styles.cell}>
                {editTaskId === task._id ? (
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                ) : (
                  task.description
                )}
              </td>
              <td style={styles.cell}>
                {editTaskId === task._id ? (
                  <select
                    value={formData.priorité}
                    onChange={(e) => setFormData({ ...formData, priorité: e.target.value })}
                  >
                    <option value="BASSE">BASSE</option>
                    <option value="MOYENNE">MOYENNE</option>
                    <option value="HAUTE">HAUTE</option>
                  </select>
                ) : (
                  task.priorité
                )}
              </td>
              <td style={styles.cell}>
                {editTaskId === task._id ? (
                  <input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                ) : (
                  task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline"
                )}
              </td>
              <td style={styles.cell}>
                {editTaskId === task._id ? (
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  >
                    <option value="À FAIRE">À FAIRE</option>
                    <option value="EN COURS">EN COURS</option>
                    <option value="TERMINÉ">TERMINÉ</option>
                  </select>
                ) : (
                  task.statut
                )}
              </td>
              <td style={styles.cell}>
                {editTaskId === task._id ? (
                  <>
                    <button onClick={handleSave} style={styles.saveButton}>Save</button>
                    <button onClick={handleCancelEdit} style={styles.cancelButton}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(task)} style={styles.editButton}>Edit</button>
                    <button onClick={() => handleDelete(task._id)} style={styles.deleteButton}>Delete</button>
                  </>
                )}
              </td>
              <td style={styles.cell}>
                <textarea
                  value={commentInputs[task._id] || ""}
                  onChange={(e) => handleCommentChange(task._id, e.target.value)}
                  placeholder="Add a comment..."
                  rows="3"
                  style={styles.commentInput}
                />
                <button onClick={() => handleAddComment(task._id)} style={styles.commentButton}>
                  Add Comment
                </button>
                <div>
                  {task.comments && task.comments.map((comment, index) => (
                    <div key={index} style={styles.comment}>
                      <strong>{comment.auteur}: </strong>
                      <span>{comment.contenu}</span>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  backArrow: {
    fontSize: "16px",
    color: "#007bff",
    textDecoration: "none",
    cursor: "pointer",
    float: 'right',
    marginButtom: "5%",
    padding: '10px'
  },
  header: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px",
    textAlign: "left",
  },
  cell: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
  editButton: {
    marginRight: "10px",
    padding: "5px 10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  saveButton: {
    marginRight: "10px",
    padding: "5px 10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "5px 10px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  addButton: {
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  commentInput: {
    width: "100%",
    marginBottom: "5px",
  },
  commentButton: {
    padding: "5px 10px",
    backgroundColor: "#17a2b8",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  comment: {
    marginTop: "5px",
    padding: "5px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    fontSize: "0.9em",
  }
};

export default TaskTable;