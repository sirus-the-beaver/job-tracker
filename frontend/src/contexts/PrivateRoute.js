// Citation for the following:
// Date: 07/16/2025
// Source: https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5
// Author(s): Makanju Oluwafemi

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = () => {
    const user = useAuth();
    // If user is not authenticated, redirect to login page
    if (!user.token) return <Navigate to="/login" />;
    // If user is authenticated, render the child components
    return <Outlet />;
};
export default PrivateRoute;