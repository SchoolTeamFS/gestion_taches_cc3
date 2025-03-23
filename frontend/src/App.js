import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import Header from "./components/Header";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/home";
import Register from "./components/Register";
import Chat from "./components/Chat";
import Projet from "./components/Projet";
import Taches from "./components/Taches";
import MangeUser from "./components/MangeUser";
import UpdateUser from "./components/UpdateUser";
import DashBoard from "./components/Dashboard";
import KanbanBoard from "./components/KanbanBoard";
import TaskForm from "./components/TaskForm";


function App() {
  return (
    <AuthProvider>
        <TaskProvider>
      <Router>
        <Header />
        <div style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/dashBoard" element={<DashBoard/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/manage_users" element={<PrivateRoute><MangeUser /></PrivateRoute>} />
            <Route path="/update_user/:id" element={<PrivateRoute><UpdateUser /></PrivateRoute>} />
            <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
            <Route path="/projets" element={<PrivateRoute><Projet /></PrivateRoute>} />
            <Route path="/taches" element={<PrivateRoute><Taches /></PrivateRoute>} />
            <Route path="/taches/add" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
            <Route path="/taches/kanban" element={<PrivateRoute><KanbanBoard /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
