// src/contexts/AuthContext.jsx (Enhanced)
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

  // Load current user on mount
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const token = localStorage.getItem("academex_token");
        
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.data?.success) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem("academex_token");
        }
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("academex_token");
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, [API_URL]);

  // Login function with faculty level support
  const login = useCallback(async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials, {
        withCredentials: true,
      });

      if (response.data?.success) {
        const { user, token } = response.data;
        
        // Handle faculty level assignment
        if (user.role === "FACULTY") {
          // If backend doesn't provide facultyLevel, use the one from credentials
          if (!user.facultyLevel && credentials.facultyLevel) {
            user.facultyLevel = credentials.facultyLevel;
          }
        }
        
        localStorage.setItem("academex_token", token);
        setUser(user);
        addToast(`Welcome back, ${user.name || user.username}!`, "success");
        return { success: true, user };
      } else {
        addToast(response.data?.message || "Login failed", "error");
        return { success: false };
      }
    } catch (error) {
      console.error("Login error:", error);
      const message = error.response?.data?.message || "Login failed. Please try again.";
      addToast(message, "error");
      return { success: false };
    }
  }, [API_URL, addToast]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("academex_token");
      addToast("Logged out successfully", "info");
    }
  }, [API_URL, addToast]);

  // Check permissions
  const hasPermission = useCallback((requiredRole, requiredLevel = null) => {
    if (!user) return false;
    
    if (user.role !== requiredRole) return false;
    
    if (requiredRole === "FACULTY" && requiredLevel && user.facultyLevel) {
      const levels = { PROFESSOR: 1, HOD: 2, DEAN: 3 };
      return levels[user.facultyLevel] >= levels[requiredLevel];
    }
    
    return true;
  }, [user]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}