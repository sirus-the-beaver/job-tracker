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
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    const navigate = useNavigate();
    const login = async(data) => {
        try {
            const req = await axios.post('', data);
            const res = await req.data;
            if (res.data) {
                setUser(res.data.user);
                setToken(res.data.token);
                localStorage.setItem('token', res.data.token);
                navigate('/');
                return;
            }
            throw new Error('Login failed');
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Login failed');
        }
    };
    const logout = () => {
        setUser(null);
        setToken('');
        localStorage.removeItem('token');
        navigate('/login');
    }
    return ( 
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

// This hook allows components to access the authentication context
export const useAuth = () => {
    return useContext(AuthContext);
};