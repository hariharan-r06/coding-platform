import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { BookOpen, CheckCircle, Trophy } from 'lucide-react';
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

    // Helper to map pattern stats by name/id for easy access
    const patternStats = stats?.pattern_breakdown?.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
    }, {}) || {};

    return (
        <div className="animate-fade">
            <header className="mb-8">
                <h1 className="text-primary">Hello, {user.full_name.split(' ')[0]}</h1>
                <p className="text-lg">Here's your coding progress for today.</p>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 mb-8">
                <div className="card stat-card glass">
                    <div className="stat-icon" style={{ color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)' }}>
                        <Trophy size={28} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">
                            {stats?.overview?.solved || 0}
                            <span className="text-sm text-muted font-normal ml-1">/ {stats?.overview?.total || 0}</span>
                        </div>
                        <div className="text-sm text-muted">Problems Solved</div>
                    </div>
                </div>

                <div className="card stat-card glass">
                    <div className="stat-icon" style={{ color: 'var(--secondary)', background: 'rgba(236, 72, 153, 0.1)' }}>
                        <BookOpen size={28} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{patterns.length}</div>
                        <div className="text-sm text-muted">Patterns Available</div>
                    </div>
                </div>

                <div className="card stat-card glass">
                    <div className="stat-icon" style={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)' }}>
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{stats?.overview?.percentage || 0}%</div>
                        <div className="text-sm text-muted">Completion Rate</div>
                    </div>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Pattern List */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2>Problem Patterns</h2>
                        <button className="btn btn-secondary text-sm">View All</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {patterns.map(pattern => (
                            <PatternCard
                                key={pattern.id}
                                pattern={pattern}
                                progress={patternStats[pattern.id] || { solved: 0, total: 0 }}
                            />
                        ))}
                    </div>
                </section>

                {/* Analytics */}
                <section className="flex flex-col gap-6">
                    <div>
                        <h2 className="mb-4">Analytics</h2>
                        <div className="card glass flex flex-col gap-4">
                            <h3 className="text-lg font-semibold">Solved by Difficulty</h3>
                            <div className="flex flex-col gap-3 p-2">
                                {stats?.difficulty_breakdown?.map(item => (
                                    <div key={item.label} className="flex items-center justify-between text-sm">
                                        <div className="font-medium text-muted">{item.label}</div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-white">{item.solved}/{item.total}</span>
                                            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${item.label === 'Easy' ? 'bg-success' :
                                                        item.label === 'Medium' ? 'bg-warning' : 'bg-error'
                                                        }`}
                                                    style={{ width: `${item.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!stats?.difficulty_breakdown || stats.difficulty_breakdown.length === 0) &&
                                    <p className="text-muted text-sm">No data available yet.</p>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="card glass flex flex-col gap-4">
                        <h3 className="text-lg font-semibold">Solved by Pattern</h3>
                        <div className="p-2">
                            <ProgressChart
                                data={stats?.pattern_breakdown?.map(p => ({
                                    name: p.name,
                                    count: p.solved,
                                    total: p.total
                                }))}
                                type="bar"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserDashboard;
