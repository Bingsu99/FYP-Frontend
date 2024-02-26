// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Export the context to be used in other components
export default AuthContext;

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true");
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole")); // Initialize directly

  // Placeholder for login logic, now also sets user role
  const login = (role) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", role); // Store user role in localStorage
    setIsAuthenticated(true);
    setUserRole(role); // Update state
  };

  // Placeholder for logout logic, now also clears user role
  const logout = () => {
    localStorage.setItem("isAuthenticated", "false");
    localStorage.removeItem("userRole"); // Clear user role from localStorage
    setIsAuthenticated(false);
    setUserRole(null); // Reset user role state
  };

  // Check the user's auth state and role when the app loads
  useEffect(() => {
    const storedAuthState = localStorage.getItem("isAuthenticated");
    const storedUserRole = localStorage.getItem("userRole");
    setIsAuthenticated(storedAuthState === "true");
    setUserRole(storedUserRole);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
