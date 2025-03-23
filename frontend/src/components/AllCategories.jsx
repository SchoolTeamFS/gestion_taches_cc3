import React, { useEffect, useState } from "react";
import proApi from "../api/proApi";
import { NavLink } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";

const AllCategories = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(null);
    const [updatedCategory, setUpdatedCategory] = useState({});

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await proApi.get("/categories", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(response.data);
        } catch (error) {
            setError("Error fetching categories");
        }
    };

    const handleUpdate = async (categoryId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await proApi.put(`/updateCategory/${categoryId}`, updatedCategory, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories((prevCategories) =>
                prevCategories.map((category) =>
                    category._id === categoryId ? response.data : category
                )
            );
            setIsEditing(null); 
        } catch (error) {
            setError("Error updating category");
        }
    };

    const handleDelete = async (categoryId) => {
        try {
            const token = localStorage.getItem("token");
            await proApi.delete(`/deleteCategory/${categoryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories((prevCategories) =>
                prevCategories.filter((category) => category._id !== categoryId)
            );
        } catch (error) {
            setError("Error deleting category");
        }
    };

    const handleChange = (e) => {
        setUpdatedCategory({
            ...updatedCategory,
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
        categoryList: {
            listStyle: "none",
            paddingLeft: "0",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
        },
        categoryItem: {
            display: "flex",
            width: "150px",
            flexDirection: "column",
            marginBottom: "20px",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
        },
        categoryTitle: {
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "10px",
        },
        categoryActions: {
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
            color: "white",
        },
        updateButton: {
            backgroundColor: "#007BFF",
            color: "white",
        },
        deleteButton: {
            backgroundColor: "#DC3545",
            color: "white",
        },
        inputField: {
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
            <NavLink to="/AddCategory">
                <button style={styles.button}>Add Category</button>
            </NavLink>
            <h2>All Categories</h2>
            {error && <p style={styles.error}>{error}</p>}
            {categories.length === 0 ? (
                <p>No categories found</p>
            ) : (
                <ul style={styles.categoryList}>
                    {categories.map((category) => (
                        <li key={category._id} style={styles.categoryItem}>
                            {isEditing === category._id ? (
                                <div>
                                    <input
                                        type="text"
                                        name="nom"
                                        value={updatedCategory.nom || category.nom}
                                        onChange={handleChange}
                                        style={styles.inputField}
                                    />
                                    <button
                                        onClick={() => handleUpdate(category._id)}
                                        style={styles.button}
                                    >
                                        Update
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <span style={styles.categoryTitle}>{category.nom}</span>
                                    <div style={styles.categoryActions}>
                                        <span onClick={() => setIsEditing(category._id)}>
                                            <FaPen style={{ cursor: "pointer", color: "#007BFF" }} />
                                        </span>
                                        <span onClick={() => handleDelete(category._id)}>
                                            <FaRegTrashAlt style={{ cursor: "pointer", color: "#DC3545" }} />
                                        </span>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AllCategories;
