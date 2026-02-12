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
        <nav className="navbar">
            <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.25rem' }}>
                <Code2 color="var(--primary)" size={32} />
                <span>CodePractice</span>
            </Link>

            <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="avatar" style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-light)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                        <UserIcon size={18} />
                    </div>
                    <div className="user-details" style={{ fontSize: '0.875rem' }}>
                        <div style={{ fontWeight: 600 }}>{user?.full_name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{user?.role === 'admin' ? 'Administrator' : 'Explorer'}</div>
                    </div>
                </div>

                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }} title="Logout">
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
