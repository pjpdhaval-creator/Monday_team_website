import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaSignOutAlt, FaUserCircle, FaBars, FaSun, FaMoon } from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="header">
            <div className="header-left">
                <button className="mobile-toggle" onClick={toggleSidebar} title="Toggle Sidebar">
                    <FaBars />
                </button>
                <div className="header-title">
                    <h2 className="text-xl font-bold">Monday Team Stock Management</h2>
                </div>
            </div>
            <div className="user-profile">
                <div className="flex flex-col text-right hide-mobile">
                    <span className="font-bold text-sm">{user?.email}</span>
                    <span className="text-sm text-muted">{user?.role}</span>
                </div>
                <div className="avatar">
                    <FaUserCircle size={24} />
                </div>

                {/* ===== Dark / Light Mode Toggle ===== */}
                <button
                    onClick={toggleTheme}
                    className="theme-toggle-btn"
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    aria-label="Toggle dark mode"
                >
                    <span className="theme-toggle-track">
                        <span className="theme-toggle-thumb" />
                        <span className="theme-toggle-icon theme-toggle-sun">
                            <FaSun size={11} />
                        </span>
                        <span className="theme-toggle-icon theme-toggle-moon">
                            <FaMoon size={11} />
                        </span>
                    </span>
                </button>

                <button
                    onClick={logout}
                    className="btn btn-outline"
                    style={{ padding: '0.4rem 0.8rem' }}
                    title="Logout"
                >
                    <FaSignOutAlt />
                </button>
            </div>
        </header>
    );
};

export default Header;
