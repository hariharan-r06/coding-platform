import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { BookOpen, CheckCircle, Clock, Trophy } from 'lucide-react';
import PatternCard from '../components/user/PatternCard';
import ProgressChart from '../components/user/ProgressChart';

const UserDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [patterns, setPatterns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, patternsRes] = await Promise.all([
                    api.get(`/stats/user/${user.id}`),
                    api.get('/patterns')
                ]);
                setStats(statsRes.data);
                setPatterns(patternsRes.data);
            } catch (err) {
                console.error('Error fetching dashboard data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user.id]);

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="animate-fade">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Hello, {user.full_name.split(' ')[0]} 👋</h1>
                <p style={{ color: 'var(--text-muted)' }}>Here's your coding progress for today.</p>
            </header>

            {/* Stats Overview */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '2.5rem' }}>
                <div className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                        <Trophy size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats?.total_solved}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Problems Solved</div>
                    </div>
                </div>

                <div className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                        <BookOpen size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{patterns.length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Patterns Available</div>
                    </div>
                </div>

                <div className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{Math.round((stats?.total_solved / 100) * 100) || 0}%</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Practice Goal</div>
                    </div>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start' }}>
                {/* Pattern List */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Problem Patterns</h2>
                        <button className="btn-secondary" style={{ fontSize: '0.875rem' }}>View All</button>
                    </div>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        {patterns.map(pattern => (
                            <PatternCard key={pattern.id} pattern={pattern} />
                        ))}
                    </div>
                </section>

                {/* Analytics */}
                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Analytics</h2>
                    <div className="card glass">
                        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Solved by Difficulty</h3>
                        <ProgressChart data={stats?.by_difficulty} type="doughnut" />
                    </div>
                    <div className="card glass" style={{ marginTop: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Solved by Pattern</h3>
                        <ProgressChart data={stats?.by_pattern} type="bar" />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserDashboard;
