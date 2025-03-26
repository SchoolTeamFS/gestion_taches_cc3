import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#333',
      color: '#fff',
    },
    logo: {
      margin: 0,
    },
    navLinks: {
      listStyle: 'none',
      display: 'flex',
      gap: '20px',
    },
    link: {
      color: '#fff',
      textDecoration: 'none',
      fontSize: '16px',
    },
    button: {
      background: "none",
      color: "white",
      border: "none",
      cursor: "pointer",
    },
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Task Management</h2>
      <ul style={styles.navLinks}>
      {user && user.role === "admin" ? (
        <li><Link to="/dashBoard" style={styles.link}>DashBoard</Link></li>
        ): "" } 
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/chat" style={styles.link}>Chat</Link></li>
        <li><Link to="/projets" style={styles.link}>Projet</Link></li>
        <li><Link to="/categorie" style={styles.link}>Categorie</Link></li>
        <li><Link to="/taches" style={styles.link}>Taches</Link></li>
        {user && user.role === "admin" ? (
        <li><Link to="/manage_users" style={styles.link}>Mange User</Link></li>
        ): "" }
        {user ? (
          <li><button onClick={logout} style={styles.button}>Logout</button></li>
        ) : (
          <div style={styles.navLinks}>
            <div><li><Link to="/login" style={styles.link}>Login</Link></li></div>
            <div><li><Link to="/register" style={styles.link}>Register</Link></li></div>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Header;
