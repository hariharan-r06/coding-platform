import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BarChart3, User, ShieldCheck, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MobileNav = () => {
    const { isAdmin } = useAuth();

    const links = [
        { to: '/', icon: <LayoutDashboard size={20} />, label: 'Home' },
        { to: '/patterns', icon: <BookOpen size={20} />, label: 'Patterns' },
        { to: '/submissions', icon: <BarChart3 size={20} />, label: 'Stats' },
        { to: '/profile', icon: <User size={20} />, label: 'Profile' },
    ];

    if (isAdmin) {
        links.push({ to: '/admin', icon: <ShieldCheck size={20} />, label: 'Admin', admin: true });
        // Manage is probably too much for mobile nav bar, usually max 5 items. 
        // But let's add it if needed, or user can access it via Admin Dashboard if we link it there.
        // For now, let's keep it simple. Admin dashboard is enough.
    }

    return (
        <nav className="mobile-nav">
            {links.map(link => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                >
                    {link.icon}
                    <span className="text-[10px]">{link.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default MobileNav;
