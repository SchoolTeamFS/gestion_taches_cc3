import React, { useState } from 'react'; 
import { useNavigate } from "react-router-dom";
import authApi from '../api/authApi';

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, email, password, role } = formData;

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
        if (!token) {
            setError("No token found. Please log in.");
            return;
        }

        const url = "/auth/add";
        const response = await authApi.post(url, formData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("User added successfully:", response.data);
        navigate("/manage_users");
    } catch (error) {
        if (error.response) {
            setError(error.response.data.msg);
        } else {
            setError("Error adding user");
        }
        console.error("Error:", error);
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
      textAlign: "center"
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
    select: {
      padding: "10px",
      fontSize: "16px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      width: "100%",
    },
    button: {
      padding: "10px",
      fontSize: "16px",
      border: "none",
      borderRadius: "5px",
      backgroundColor: "#007BFF",
      color: "white",
      cursor: "pointer",
      transition: "background 0.3s",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    error: {
      color: "red",
      fontSize: "14px",
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <h2>Add User</h2>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={name}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
          style={styles.input}
        />
        <select 
            name="role" 
            value={role} 
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
          Register
        </button>
      </form>
    </div>
  );
};

export default AddUser;
