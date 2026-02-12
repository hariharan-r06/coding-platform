import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User as UserIcon, Code2 } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar glass border-b border-white/5">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity">
                <Code2 className="text-primary" size={32} strokeWidth={2.5} />
                <span className="text-white tracking-tight">Code<span className="text-primary">Practice</span></span>
            </Link>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <UserIcon size={18} />
                    </div>
                    <div className="hidden md:block text-sm">
                        <div className="font-semibold text-white">{user?.full_name}</div>
                        <div className="text-xs text-muted uppercase tracking-wider font-medium">{user?.role === 'admin' ? 'Administrator' : 'Explorer'}</div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-white/10 text-muted hover:text-error transition-colors"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
