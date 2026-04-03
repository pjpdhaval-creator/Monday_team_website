import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    // Initialize from localStorage, default to 'light'
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('bsm-theme') || 'light';
    });

    // Apply theme class to <html> element whenever it changes
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark-mode');
        } else {
            root.classList.remove('dark-mode');
        }
        localStorage.setItem('bsm-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
