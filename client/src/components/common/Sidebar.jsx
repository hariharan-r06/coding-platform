import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CheckSquare, User, ShieldCheck, BarChart3, Settings, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { isAdmin, logout } = useAuth(); // Import logout here if we want mobile logout in sidebar

    const links = [
        { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { to: '/patterns', icon: <BookOpen size={20} />, label: 'Patterns' },
        { to: '/submissions', icon: <BarChart3 size={20} />, label: 'Submissions' },
        { to: '/profile', icon: <User size={20} />, label: 'Profile' },
    ];

    if (isAdmin) {
        links.push({ to: '/admin', icon: <ShieldCheck size={20} />, label: 'Admin', admin: true });
        links.push({ to: '/admin/manage', icon: <Settings size={20} />, label: 'Manage Content', admin: true });
    }

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onClick={onClose}
            />

            <aside className={`sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="flex justify-between items-center md:hidden mb-4 px-2">
                    <span className="font-bold text-lg">Menu</span>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="px-4 pb-2 text-xs font-bold uppercase text-muted tracking-wider hidden md:block">
                        Menu
                    </div>
                    {links.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => onClose && onClose()} // Close on link click (mobile)
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="mt-auto px-4 py-6 border-t border-white/5">
                    <div className="text-xs text-muted text-center">
                        &copy; 2026 CodePractice
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
