import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // State for user details (email, id, role) and loading status
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to load the user details from the backend using the stored token
  const loadUser = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        // Hitting the protected /auth/me endpoint
        const response = await apiClient.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        // Token expired or invalid
        console.error("Token invalid or expired.", error);
        localStorage.removeItem('access_token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      // 1. Get token from backend
      const response = await apiClient.post('/auth/login', new URLSearchParams({
        username: email,
        password: password
      }), {
        // Login must use x-www-form-urlencoded header, not JSON
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const token = response.data.access_token;
      localStorage.setItem('access_token', token);

      // 2. Immediately fetch user data using the new token
      await loadUser(); 
      return true;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error('Login failed. Check credentials.');
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setLoading(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    role: user?.role,
    login,
    logout,
    loadUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};