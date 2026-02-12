import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Shield, Calendar, LogOut } from 'lucide-react';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get(`/stats/user/${user.id}`);
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, [user.id]);

    return (
        <div className="animate-fade" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    margin: '0 auto 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <User size={48} />
                </div>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{user.full_name}</h1>
                <p style={{ color: 'var(--text-muted)' }}>{user.role.toUpperCase()}</p>
            </header>

            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="card glass">
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Account Details</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Mail size={18} style={{ color: 'var(--primary)' }} />
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</div>
                                <div>{user.email}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Shield size={18} style={{ color: 'var(--primary)' }} />
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Role</div>
                                <div>{user.role}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Calendar size={18} style={{ color: 'var(--primary)' }} />
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Member Since</div>
                                <div>{new Date(user.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card glass">
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Practice Statistics</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Total Solved</span>
                            <span style={{ fontWeight: 700, color: 'var(--success)' }}>{stats?.total_solved || 0}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Submissions</span>
                            <span style={{ fontWeight: 700 }}>{stats?.total_solved || 0}</span>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                            <button
                                onClick={logout}
                                className="btn btn-secondary"
                                style={{ width: '100%', color: 'var(--error)' }}
                            >
                                <LogOut size={18} /> Logout Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
