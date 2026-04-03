import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Login from '../pages/Login';

const ProtectedRoute = ({ children, requireAdmin }) => {
    const { user, canViewUsers } = useAuth();
    const location = useLocation();

    if (!user) {
        // Redirect to login page, preserving the current location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && !canViewUsers) {
        // If they are logged in but don't have permission for admin pages
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
