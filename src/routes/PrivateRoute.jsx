import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { userRole, isAuthenticated } = useContext(AuthContext);
  return isAuthenticated && allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
