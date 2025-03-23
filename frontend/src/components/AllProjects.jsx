import React, { useEffect, useState } from "react";
import proApi from "../api/proApi";
import { NavLink } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import authApi from "../api/authApi";
import { MdGroupRemove } from "react-icons/md";

const AllProjects = () => {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(null);
    const [updatedProject, setUpdatedProject] = useState({});

    useEffect(() => {
        fetchProjects();
        fetchUsers()
    }, []);

    const fetchUsers = async (keyword = '') => {
        try {
            const token = localStorage.getItem("token");
            const formattedKeyword = keyword.trim();
            const url = formattedKeyword ? `/auth/${formattedKeyword}/search` : "/auth/all";  
            const response = await authApi.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.log("Error fetching users");
        }
    };

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("token");
    
            if (!token) {
                console.error("No token found");
                return;
            }
    
            const response = await proApi.get("/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error.response?.data || error.message);
        }
    };

    const handleUpdate = async (projectId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await proApi.put(`/update/${projectId}`, updatedProject, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project._id === projectId ? response.data : project
                )
            );
            setIsEditing(null);
            setMessage("Project updated successfuly");
            setTimeout(() => {
                setMessage("");
            }, 3000); 
        } catch (error) {
            setError("Error updating project");
        }
    };

    const handleDelete = async (projectId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await proApi.delete(`/delete/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjects((prevProjects) =>
                prevProjects.filter((project) => project._id !== projectId)
            );
            setMessage(res.data.message);
            setTimeout(() => {
                setMessage("");
            }, 3000); 
        } catch (error) {
            setError("Error deleting project");
            setMessage(""); 
            setTimeout(() => {
                setError("");
            }, 3000);
        } 
        }
    };

    const handleRemoveUser = async (project_id, user_id) => {
        try {
            const token = localStorage.getItem("token");
            const res = await proApi.delete(`/removeUser/${user_id}/${project_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.message);
            setError(""); 
            setTimeout(() => {
                setMessage("");
            }, 3000); 
            fetchProjects(); 
        } catch (error) {
            setError("Error removing user");
            setMessage(""); 
            setTimeout(() => {
                setError(""); 
            }, 3000);
            console.error("Error removing user:", error.response?.data || error.message);
        }
    };

    const getUserName = (userId) => {
        const user = users.find(user => user._id === userId);
        return user ? user.name : 'User not found';
    };

    const handleChange = (e) => {
        setUpdatedProject({
            ...updatedProject,
            [e.target.name]: e.target.value,
        });
    };

    const styles = {
        container: {
            maxWidth: "900px",
            margin: "20px auto",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        },
        projectList: {
            listStyle: "none",
            paddingLeft: "0",
        },
        projectItem: {
            display: "flex",
            flexDirection: "column",
            marginBottom: "20px",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
        },
        projectTitle: {
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "10px",
        },
        projectStatus: {
            color: "#777",
            marginBottom: "15px",
        },
        projectCategorie: {
            marginBottom: "15px",
        },
        projectActions: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        },
        button: {
            padding: "8px 12px",
            fontSize: "14px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background 0.3s",
            marginRight: "10px",
            backgroundColor: "#007BFF",
            color: "white"
        },
        updateButton: {
            backgroundColor: "#007BFF",
            color: "white",
        },
        deleteButton: {
            backgroundColor: "#DC3545",
            color: "white",
        },
        enrollButton: {
            backgroundColor: "#28A745",
            color: "white",
        },
        inputField: {
            padding: "8px",
            width: "100%",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
        },
        selectField: {
            padding: "8px",
            width: "100%",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
        },
        error: {
            color: "red",
            fontSize: "14px",
            marginBottom: "10px",
        },
    };

    return (
        <div style={styles.container}>
            <NavLink to="/AddProject">
                <button style={styles.button}>Add Project</button>
            </NavLink>
            <h2>All Projects</h2>
            {error && <p style={styles.error}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}
            <ul style={styles.projectList}>
                {projects.map((project) => (
                    <li key={project._id} style={styles.projectItem}>
                        {isEditing === project._id ? (
                            <div>
                                <input
                                    type="text"
                                    name="nom"
                                    value={updatedProject.nom || project.nom}
                                    onChange={handleChange}
                                    style={styles.inputField}
                                />
                                <select
                                    name="statut"
                                    value={updatedProject.statut || project.statut}
                                    onChange={handleChange}
                                    style={styles.selectField}
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="En cours">En cours</option>
                                    <option value="Terminé">Terminé</option>
                                    <option value="En attente">En attente</option>
                                    <option value="Annulé">Annulé</option>
                                </select>
                                <button
                                    onClick={() => handleUpdate(project._id)}
                                    style={styles.button}
                                >
                                    Update
                                </button>
                            </div>
                        ) : (
                            <div>
                                <span style={styles.projectTitle}>{project.nom}</span>
                                <p style={styles.projectStatus}>{project.statut}</p>
                                <p style={styles.projectCategorie}>Categorie: {project.categorie}</p>
                                <p>Enrolled in courses:</p>
                                <ul>
                                    {Array.isArray(project?.membre) && project.membre.length > 0 ? (
                                        project.membre.map(userId => (
                                            <li key={userId}>
                                                {getUserName(userId)}
                                                <span
                                                    onClick={() => handleRemoveUser(project._id, userId)}
                                                    style={{ cursor: "pointer", color: "#DC3545", margin: "20px"}}
                                                >
                                                    <MdGroupRemove />

                                                </span>
                                            </li>
                                        ))
                                    ) : (
                                        <li>No Users enrolled</li>
                                    )}
                                </ul>
                                <div style={styles.projectActions}>
                                    <span onClick={() => setIsEditing(project._id)}>
                                        <FaPen style={{ cursor: "pointer", color: "#007BFF" }} />
                                    </span>
                                    <span onClick={() => handleDelete(project._id)}>
                                        <FaRegTrashAlt style={{ cursor: "pointer", color: "#DC3545" }} />
                                    </span>
                                    <NavLink to={`/enroll/${project._id}`}>
                                        <button style={{ ...styles.button, ...styles.enrollButton }}>
                                            Enroll User
                                        </button>
                                    </NavLink>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );

export default AllProjects;
