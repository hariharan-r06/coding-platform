import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CheckSquare, User, ShieldCheck, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { isAdmin } = useAuth();

    const links = [
        { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { to: '/patterns', icon: <BookOpen size={20} />, label: 'Patterns' },
        { to: '/problems', icon: <CheckSquare size={20} />, label: 'Problems' },
        { to: '/submissions', icon: <BarChart3 size={20} />, label: 'Submissions' },
        { to: '/profile', icon: <User size={20} />, label: 'Profile' },
    ];

    if (isAdmin) {
        links.push({ to: '/admin', icon: <ShieldCheck size={20} />, label: 'Admin Panel', admin: true });
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-group">
                <div style={{ padding: '0 1rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Menu
                </div>
                {links.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
