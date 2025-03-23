



import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [error, setError] = useState({});

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) setUser(storedUser);
    }, []);
    //--------------------
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);
  console.log(user)

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      setError({mp:"Error fetching profile"});
    }
  };

  const register = async (name, email, password) => {
    try {
      await axios.post("http://localhost:5000/auth/register", { name, email, password });
    } catch (error) {
      setError({pm:"Error registering user"});
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      fetchUserProfile();
    } catch (error) {
      setError({lm:"Invalid email or password "});
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout,register, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
