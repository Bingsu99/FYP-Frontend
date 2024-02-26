import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from "../context/AuthContext";

const RedirectBasedOnRole = ( props ) => {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  if (!isAuthenticated) {
    // User not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  switch (userRole) {
    case 'patient':
      return <Navigate to="/patient" />;
    case 'therapist':
      return <Navigate to="/therapist" />;
    case 'caregiver':
      return <Navigate to="/caregiver" />;
    default:
      return <Navigate to="/login" />;
  }
};

export default RedirectBasedOnRole;
