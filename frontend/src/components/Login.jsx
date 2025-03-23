import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, error } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      await login(email, password);
      navigate("/");
    }catch(e){
      console.log(e)
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
      <h2>Login</h2>
      {error.lm && <div style={styles.error}>{error.lm}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
