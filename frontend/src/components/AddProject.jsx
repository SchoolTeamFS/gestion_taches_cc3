import React, { useState, useEffect } from "react";
import proApi from "../api/proApi";
import { useNavigate } from "react-router-dom";

const AddProject = () => {
    const [formData, setFormData] = useState({ nom: "", description: "", dateDebut: "", dateFin: "", statut: "", categorieNom: "", membre: [] });
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await proApi.get("/categories", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setCategories(response.data);
            } catch (error) {
                setMessage("Error fetching categories");
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await proApi.post("/add", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage("Project added successfully!");
            setError("");
            navigate("/projets");
        } catch (error) {
            setError("Error adding project");
            setMessage(""); 
            setTimeout(() => {
                setError("");
            }, 3000);
        }
    };

    const styles = {
        container: {
            maxWidth: "600px",
            margin: "50px auto",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
        },
        form: {
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "10px",
        },
        input: {
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "96%",
        },
        select: {
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "100%",
        },
        button: {
            padding: "12px",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer",
            transition: "background 0.3s",
        },
        buttonHover: {
            backgroundColor: "#45a049",
        },
        message: {
            color: "green",
            fontSize: "18px",
            marginBottom: "20px",
        },
        error: {
            color: "red",
            fontSize: "14px",
            marginBottom: "10px",
        },
    };

    return (
        <div style={styles.container}>
            <h2>Add Project</h2>
            {message && <p style={styles.message}>{message}</p>}
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    name="nom"
                    placeholder="Project Name"
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="date"
                    name="dateDebut"
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="date"
                    name="dateFin"
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <select
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    required
                    style={styles.select}
                >
                    <option value="">Select Statut</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                    <option value="En attente">En attente</option>
                    <option value="Annulé">Annulé</option>
                </select>
                <select
                    name="categorieNom"
                    onChange={handleChange}
                    value={formData.categorieNom}
                    required
                    style={styles.select}
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category.nom}>
                            {category.nom}
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    style={styles.button}
                    onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                    onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                >
                    Add Project
                </button>
            </form>
        </div>
    );
};

export default AddProject;
