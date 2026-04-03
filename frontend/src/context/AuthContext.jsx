import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('userInfo');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/api/users/login', { email, password });
            setUser(data);
            sessionStorage.setItem('userInfo', JSON.stringify(data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('userInfo');
        delete axios.defaults.headers.common['Authorization'];
    };

    const registerUser = async (email, password, role) => {
        try {
            const { data } = await axios.post('/api/users', { email, password, role });
            return data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    }

    const value = {
        user,
        login,
        logout,
        registerUser,
        isAdmin: user?.role?.toLowerCase() === 'admin',
        isOnlyViewer: user?.role?.toLowerCase() === 'admin-view' || user?.role?.toLowerCase() === 'user',
        canViewUsers: user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'admin-view'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
