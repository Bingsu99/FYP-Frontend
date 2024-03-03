import React, { createContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Export the context to be used in other components
export default AuthContext;

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true");
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [userID, setUserID] = useState(localStorage.getItem("userID"));  // Initialize userID from localStorage

  // Placeholder for login logic, now also sets user role and userID
  const login = (role, id) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", role); // Store user role in localStorage
    localStorage.setItem("userID", id);  // Store userID in localStorage
    setIsAuthenticated(true);
    setUserRole(role); // Update state
    setUserID(id);  // Update userID state
  };

  // Placeholder for logout logic, now also clears user role and userID
  const logout = () => {
    localStorage.setItem("isAuthenticated", "false");
    localStorage.removeItem("userRole"); // Clear user role from localStorage
    localStorage.removeItem("userID");  // Clear userID from localStorage
    setIsAuthenticated(false);
    setUserRole(null); // Reset user role state
    setUserID(null);  // Reset userID state
  };

  // Check the user's auth state, role, and ID when the app loads
  useEffect(() => {
    const storedAuthState = localStorage.getItem("isAuthenticated");
    const storedUserRole = localStorage.getItem("userRole");
    const storedUserID = localStorage.getItem("userID");
    setIsAuthenticated(storedAuthState === "true");
    setUserRole(storedUserRole);
    setUserID(storedUserID);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userID, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
