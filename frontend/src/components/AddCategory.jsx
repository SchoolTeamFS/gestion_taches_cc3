import React, { useState } from "react";
import proApi from "../api/proApi";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCategoryName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await proApi.post("/category/add", { nom: categoryName }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage("Category added successfully!");
            setError(""); 
            navigate("/categorie");
        } catch (error) {
            setError("Error adding category");
            setMessage(""); 
            setTimeout(() => {
                setError("");
            }, 3000);
            navigate("/categorie");
        }
    };

    const styles = {
        container: {
            maxWidth: "400px",
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
            <h2>Add Category</h2>
            {error && <p style={styles.error}>{error}</p>}
            {message && <p style={styles.message}>{message}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    name="categoryName"
                    value={categoryName}
                    onChange={handleChange}
                    placeholder="Category Name"
                    required
                    style={styles.input}
                />
                <button
                    type="submit"
                    style={styles.button}
                    onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                    onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                >
                    Add Category
                </button>
            </form>
        </div>
    );
};
export default AddCategory;
