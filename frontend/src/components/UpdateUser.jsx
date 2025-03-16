import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authApi from "../api/authApi";

const UpdateUser = () => {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
    });

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await authApi.get(`/auth/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setFormData({
                name: response.data.name || "",
                email: response.data.email || "",
                role: response.data.role || "",
            });

        } catch (error) {
            setError("Error fetching user");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await authApi.put(`/auth/update/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            navigate("/manage_users");
        } catch (error) {
            setError("Error updating user");
        }
    };

    const styles = {
        container: { 
            textAlign: 'center', 
            margin: '20px auto', 
            maxWidth: "400px", 
            padding: "20px", 
            borderRadius: "8px", 
            backgroundColor: "#f9f9f9", 
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
        },
        form: { 
            display: "flex", 
            flexDirection: "column", 
            gap: "15px" 
        },
        input: {
            padding: "12px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none",
            transition: "border 0.3s",
        },
        select: {
            padding: "12px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none",
            cursor: "pointer",
        },
        button: {
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "12px",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background 0.3s",
        },
        buttonHover: {
            backgroundColor: "#45a049",
        },
        error: {
            color: 'red',
            fontSize: "14px",
            marginBottom: "10px"
        }
    };

    return (
        <div style={styles.container}>
            <h2>Update User</h2>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                />
                <select 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange} 
                    style={styles.select}
                >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="membre">Membre</option>
                </select>
                <button 
                    type="submit" 
                    style={styles.button} 
                    onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                    onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                >
                    Update
                </button>
            </form>
        </div>
    );
};

export default UpdateUser;
