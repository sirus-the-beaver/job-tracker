// Citation for the following:
// Date: 07/16/2025
// Source: https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5
// Author(s): Makanju Oluwafemi

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const auth = useAuth();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="mb-4">Welcome, {auth.user}!</p>
            <button 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => {
                    auth.logout();
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;