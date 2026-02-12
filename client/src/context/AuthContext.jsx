import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    fetchUser(token);
                }
            } catch (err) {
                logout();
            }
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (token) => {
        try {
            const res = await axios.get(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
        } catch (err) {
            console.error('Fetch user error', err);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const res = await axios.post(`${API_URL}/auth/register`, userData);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
