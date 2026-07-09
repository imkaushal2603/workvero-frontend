import React from "react";
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';

function Sidebar({ menuItems }) {
    const location = useLocation();

    return (
        <aside className="sidebar">
            <nav className="sidebar-menu">
                {menuItems.map((item, index) => {
                    const isActive = item.path === "/employer/dashboard"
                        ? location.pathname === item.path
                        : location.pathname.startsWith(item.path);

                    return (
                        <Link
                            key={index}
                            to={item.path}
                            className={`menu-item ${isActive ? 'active' : ''}`}
                        >
                            {item.icon} {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

export default Sidebar;