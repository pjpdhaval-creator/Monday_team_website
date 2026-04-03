import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './Layout.css';

const Layout = () => {
    const { user, canViewUsers } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className={`layout-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
            <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
            <div className="main-content">
                <Header toggleSidebar={toggleSidebar} />
                <main className="content-area animate-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
