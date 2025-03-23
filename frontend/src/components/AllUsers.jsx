import React, { useEffect, useState } from "react";
import authApi from '../api/authApi';
import { useParams } from "react-router-dom";
import proApi from "../api/proApi";

const AllUsers = () => {
    const { project_id } = useParams();
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [search, setSearch] = useState(''); 

    const projet = projects.find(pro => pro._id === project_id);

    useEffect(() => {
        fetchUsers();
        fetchProjects();
    }, [message]); 

    const fetchUsers = async (keyword = '') => {
        try {
            const token = localStorage.getItem("token");
            const formattedKeyword = keyword.trim();
            const url = formattedKeyword ? `/auth/${formattedKeyword}/search` : "/auth/all";  
            const response = await authApi.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            setError("Error fetching users");
            console.error(error);
        }
    };

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await proApi.get("/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjects(response.data);
        } catch (error) {
            setError("Error fetching projects");
        }
    };

    const handleSearchChange = (event) => {
        const keyword = event.target.value;
        setSearch(keyword);
        fetchUsers(keyword);  
    };

    const handleEnroll = async (user_id) => {
        try {
            const token = localStorage.getItem("token");
            const res = await proApi.post(`/enroll/${user_id}/${project_id}`, {}, { 
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.message);
            fetchUsers(); 
        } catch (error) {
            setError("Error enrolling user");
            console.error("Error enrolling user:", error.response?.data || error.message);
        }
    };

    const handleRemoveUser = async (user_id) => {
        try {
            const token = localStorage.getItem("token");
            const res = await proApi.delete(`/removeUser/${user_id}/${project_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.message);
            fetchUsers(); 
        } catch (error) {
            setError("Error removing user");
            console.error("Error removing user:", error.response?.data || error.message);
        }
    };

    const styles = {
        container: {
            maxWidth: "800px",
            margin: "20px auto",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            textAlign: "center"
        },
        table: {
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            textAlign: "center",
        },
        th: {
            backgroundColor: "#333",
            color: "white",
            padding: "12px",
        },
        td: {
            border: "1px solid #ddd",
            padding: "10px",
        },
        button: {
            padding: "8px 12px",
            fontSize: "14px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background 0.3s",
            marginRight: "5px",
        },
        updateButton: {
            backgroundColor: "#007BFF",
            color: "white",
        },
        updateButtonHover: {
            backgroundColor: "#0056b3",
        },
        deleteButton: {
            backgroundColor: "#DC3545",
            color: "white",
        },
        deleteButtonHover: {
            backgroundColor: "#a71d2a",
        },
        error: {
            color: "red",
            fontSize: "14px",
            marginBottom: "10px",
        },
        message: {
            color: "green",
            fontSize: "14px",
            marginBottom: "10px",
        },
        searchInput: {
            padding: "8px 12px",
            width: "80%",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            fontSize: "14px",
            marginRight: "10px",
        },
    };

    return (
        <div style={styles.container}>
            <h2>Enroll Users</h2>
            {error && <p style={styles.error}>{error}</p>}
            {message && <p style={styles.message}>{message}</p>}
            <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by name, email or role"
                style={styles.searchInput}
            />

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Role</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td style={styles.td}>
                                {projet && projet.membre && projet.membre.includes(user._id) ? "Enrolled" : ""}
                            </td>
                            <td style={styles.td}>{user.name}</td>
                            <td style={styles.td}>{user.email}</td>
                            <td style={styles.td}>{user.role}</td>
                            <td style={styles.td}>
                                <button
                                    style={{ ...styles.button, ...styles.updateButton }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = styles.updateButtonHover.backgroundColor}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = styles.updateButton.backgroundColor}
                                    onClick={() => handleEnroll(user._id)}
                                >
                                    Enroll
                                </button>
                                <button
                                    style={{ ...styles.button, ...styles.deleteButton }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = styles.deleteButtonHover.backgroundColor}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = styles.deleteButton.backgroundColor}
                                    onClick={() => handleRemoveUser(user._id)}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllUsers;
