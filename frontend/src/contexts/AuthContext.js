// Citation for the following:
// Date: 07/16/2025
// Source: https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5
// Author(s): Makanju Oluwafemi

import { useContext, createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

// This component provides the authentication context to its children
const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    const navigate = useNavigate();
    const login = async(data) => {
        try {
            const req = await axios.post('http://localhost:5043/user/login', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const res = await req.data;
            if (res.token) {
                setToken(res.token);
                localStorage.setItem('token', res.token);
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
    const logout = () => {
        setToken('');
        localStorage.removeItem('token');
        navigate('/login');
    }
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