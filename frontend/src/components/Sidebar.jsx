import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FaChartPie,
    FaBook,
    FaShoppingCart,
    FaMoneyBillWave,
    FaUsers,
    FaBookOpen
} from 'react-icons/fa';

const Sidebar = ({ closeSidebar }) => {
    const { canViewUsers } = useAuth();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <FaBookOpen size={24} />
                <span>Book Manager</span>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                    <FaChartPie /> Dashboard
                </NavLink>
                <NavLink to="/books" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                    <FaBook /> Books
                </NavLink>
                <NavLink to="/purchases" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                    <FaShoppingCart /> Purchases
                </NavLink>
                <NavLink to="/sales" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                    <FaMoneyBillWave /> Sales
                </NavLink>
                {canViewUsers && (
                    <NavLink to="/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                        <FaUsers /> Users
                    </NavLink>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;
