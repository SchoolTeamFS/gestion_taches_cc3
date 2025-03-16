import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from "react-router-dom";


const Register = () => {
  const { register, error } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const {name, email, password} = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name, email, password} = formData
    await register(name, email, password);
    navigate("/login");
  };
  console.log(formData)
  const styles = {
    container: { textAlign: 'center', margin: '20px', maxWidth: "350px", border:'black dashed 1px', margin: "auto" },
    form: { display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", margin: "auto" },
  };
  return (
    <div style={styles.container}>
      <h2>Register</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={name}
          onChange={handleChange}
        />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
