// Citation for the following:
// Date: 07/16/2025
// Source: https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5
// Author(s): Makanju Oluwafemi

import { useContext, createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

// This component provides the authentication context to its children
const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '');

    const navigate = useNavigate();
    const login = async(data) => {
        try {
            const req = await axios.post('http://localhost:5045/user/login', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const res = await req.data;
            if (res.token) {
                setToken(res.token);
                setRefreshToken(res.refreshToken);
                localStorage.setItem('token', res.token);
                localStorage.setItem('refreshToken', res.refreshToken);
                navigate('/');
                return {
                    success: true,
                    message: 'Login successful',
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Login failed. Please check your credentials and try again.',
            };
        }
    };

    const logout = useCallback(() => {
        setToken('');
        setRefreshToken('');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    }, [navigate]);

    useEffect(() => {
        const refreshTokenHandler = async () => {
            try {
                const req = await axios.post('http://localhost:5045/user/refresh-token', { refreshToken }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const res = await req.data;
                if (res.token) {
                    setToken(res.token);
                    setRefreshToken(res.refreshToken);
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('refreshToken', res.refreshToken);
                }
            } catch (error) {
                console.error('Refresh token error:', error);
                logout();
            }
        };

        const refreshInterval = setInterval(() => {
            if (refreshToken) {
                refreshTokenHandler();
            }
        }, 59 * 60 * 1000); // Refresh every 59 minutes

        const refreshTokenExiry = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        const refreshTokenTimeout = setTimeout(() => {
            logout();
        }, refreshTokenExiry);
        return () => {
            clearInterval(refreshInterval);
            clearTimeout(refreshTokenTimeout);
        };
    }, [refreshToken, logout]);

    return ( 
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

// This hook allows components to access the authentication context
export const useAuth = () => {
    return useContext(AuthContext);
};