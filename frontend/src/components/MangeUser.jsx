import React, { useEffect, useState } from "react";
import authApi from '../api/authApi';
import { useNavigate } from "react-router-dom";
import { ImBlocked } from "react-icons/im";

const ManageUser = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [search, setSearch] = useState(''); 
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async (keyword = '') => {
        try {
            const token = localStorage.getItem("token");
            console.log("Token:", token); 
            const formattedKeyword = keyword.trim();
            const url = formattedKeyword ? `/auth/${formattedKeyword}/search` : "/auth/all";  
            const response = await authApi.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            setError("Error fetching users");
            console.log(error)
        }
    };

    const handleSearchChange = (event) => {
        const keyword = event.target.value;
        setSearch(keyword);
        fetchUsers(keyword);  
    };

    const handleUpdate = (id) => {
        navigate(`/update_user/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await authApi.delete(`/auth/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers(); 
        } catch (error) {
            setError("Error deleting user");
        }
    };

    const ToggleBlock = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await authApi.patch(`/auth/${id}/ToggleBlock`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers(); 
        } catch (error) {
            setError("Error toggling block.");
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
            <h2>Manage Users</h2>
            {error && <p style={styles.error}>{error}</p>}

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
                        <th style={styles.th}>Block</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Role</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td style={{ ...styles.td, cursor: "pointer" }} onClick={() => ToggleBlock(user._id)}>
                                <ImBlocked style={{ color: user.isBlocked ? "red" : "black" }} />
                            </td>
                            <td style={styles.td}>{user.name}</td>
                            <td style={styles.td}>{user.email}</td>
                            <td style={styles.td}>{user.role}</td>
                            <td style={styles.td}>
                                <button
                                    style={{ ...styles.button, ...styles.updateButton }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = styles.updateButtonHover.backgroundColor}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = styles.updateButton.backgroundColor}
                                    onClick={() => handleUpdate(user._id)}
                                >
                                    Update
                                </button>
                                <button
                                    style={{ ...styles.button, ...styles.deleteButton }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = styles.deleteButtonHover.backgroundColor}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = styles.deleteButton.backgroundColor}
                                    onClick={() => handleDelete(user._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUser;
