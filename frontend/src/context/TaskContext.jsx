import React, { createContext, useState, useContext } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskStatus,
  fetchComments,
  addComment,
} from '../api/taskApi'; 


const TaskContext = createContext();


export const useTaskContext = () => {
  return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);


  const fetchAllTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const fetchedTasks = await fetchTasks(token);
      setTasks(fetchedTasks);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  
  const addNewTask = async (newTask) => {
    try {
      const token = localStorage.getItem("authToken");
      const createdTask = await createTask(newTask, token);
      setTasks((prevTasks) => [...prevTasks, createdTask]);
    } catch (err) {
      setError("Failed to create task");
    }
  };


  const modifyTask = async (id, updatedTask) => {
    try {
      const token = localStorage.getItem("authToken");
      const updatedTaskData = await updateTask(id, updatedTask, token);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, ...updatedTaskData } : task
        )
      );
    } catch (err) {
      setError("Failed to update task");
    }
  };


  const removeTask = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await deleteTask(id, token);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  
  const assignTaskToUser = async (id, userId) => {
    try {
      const token = localStorage.getItem("authToken");
      const assignedTask = await assignTask(id, userId, token);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, assignéÀ: userId } : task
        )
      );
    } catch (err) {
      setError("Failed to assign task");
    }
  };

 
  const updateTaskState = async (id, status) => {
    try {
      const token = localStorage.getItem("authToken");
      const updatedTask = await updateTaskStatus(id, status, token);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, statut: status } : task
        )
      );
    } catch (err) {
      setError("Failed to update task status");
    }
  };

 
  const fetchTaskComments = async (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      const fetchedComments = await fetchComments(taskId, token);
      setComments(fetchedComments);
    } catch (err) {
      setError("Failed to fetch comments");
    }
  };


  const addCommentToTask = async (taskId, comment) => {
    try {
      const token = localStorage.getItem("authToken");
      const newComment = await addComment(taskId, comment, token);
      setComments((prevComments) => [...prevComments, newComment]);
    } catch (err) {
      setError("Failed to add comment");
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        comments,
        fetchAllTasks,
        addNewTask,
        modifyTask,
        removeTask,
        assignTaskToUser,
        updateTaskState,
        fetchTaskComments,
        addCommentToTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
