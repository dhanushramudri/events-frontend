import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/constants";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);
      console.log("Checking auth status...");

      if (!token) {
        console.log("No token found in localStorage");
        setLoading(false);
        return;
      }

      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("Set axios default Authorization header");

        const response = await axios.get(`${API_URL}/auth/me`);
        console.log("Auth /me response:", response.data);

        if (response.data && response.data.user) {
          console.log("User authenticated ✅:", response.data.user);
          setCurrentUser(response.data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error(
          "Auth verification error ❌:",
          err.response?.data || err.message
        );
        localStorage.removeItem("token"); // Changed from adminToken to token
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setError(null);
    console.log("Attempting login...");

    try {
      // Updated to match your original login endpoint in the Login component
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      console.log("Login successful ✅", { token, user });

      localStorage.setItem("token", token); // Changed from adminToken to token
      if (user?.role) {
        localStorage.setItem("role", user.role);
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setCurrentUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      console.error("Login failed ❌:", message);
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    delete axios.defaults.headers.common["Authorization"];
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
