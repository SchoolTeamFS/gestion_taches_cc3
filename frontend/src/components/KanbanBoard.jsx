import React, { useEffect } from "react";
import { useTaskContext } from "../context/TaskContext";

const KanbanBoard = () => {
  const { tasks, fetchTasks, loading, error } = useTaskContext();

  useEffect(() => {
    fetchTasks(); // Charger les tâches à partir de l'API
  }, [fetchTasks]);

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Kanban Board</h2>
      <div>
        {tasks.map((task) => (
          <div key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Priority: {task.priority}</p>
            <p>Deadline: {new Date(task.deadline).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
