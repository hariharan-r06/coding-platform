import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, FileCheck, AlertCircle, Plus, Edit2, Trash2, ExternalLink, X } from 'lucide-react';
import PatternForm from '../components/admin/PatternForm';
import ProblemForm from '../components/admin/ProblemForm';

const AdminDashboard = () => {
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState({ total_users: 0, pending_submissions: 0, total_problems: 0 });
    const [loading, setLoading] = useState(true);

    const [isPatternFormOpen, setIsPatternFormOpen] = useState(false);
    const [isProblemFormOpen, setIsProblemFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const [subsRes, leaderboardRes, problemsRes] = await Promise.all([
                api.get('/submissions'),
                api.get('/stats/leaderboard'),
                api.get('/problems')
            ]);

            setSubmissions(subsRes.data);
            setStats({
                total_users: leaderboardRes.data.length,
                pending_submissions: subsRes.data.filter(s => s.status === 'pending').length,
                total_problems: problemsRes.data.length
            });
        } catch (err) {
            console.error('Error fetching admin data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.patch(`/submissions/${id}/status`, { status });
            fetchAdminData(); // Refresh
        } catch (err) {
            alert('Error updating status');
        }
    };

    const handleDeleteSubmission = async (id) => {
        if (window.confirm('Are you sure you want to delete this submission?')) {
            try {
                await api.delete(`/submissions/${id}`);
                fetchAdminData();
            } catch (err) {
                alert('Error deleting submission');
            }
        }
    };

    if (loading) return <div>Loading Admin Panel...</div>;

    return (
        <div className="animate-fade">
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Admin Control Center</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage patterns, problems, and review student work.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setIsPatternFormOpen(true)} className="btn btn-secondary"><Plus size={18} /> New Pattern</button>
                    <button onClick={() => setIsProblemFormOpen(true)} className="btn btn-primary"><Plus size={18} /> Add Problem</button>
                </div>
            </header>

            {/* Admin Stats */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '3rem' }}>
                <div className="card glass">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.75rem', borderRadius: 'var(--radius)' }}>
                            <Users size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.total_users}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active Students</div>
                        </div>
                    </div>
                </div>

                <div className="card glass">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', padding: '0.75rem', borderRadius: 'var(--radius)' }}>
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.pending_submissions}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Pending Reviews</div>
                        </div>
                    </div>
                </div>

                <div className="card glass">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.75rem', borderRadius: 'var(--radius)' }}>
                            <FileCheck size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.total_problems}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Problems</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submissions Review Table */}
            <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Submissions Review</h2>
                <div className="card glass" style={{ overflowX: 'auto', padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Student</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Problem</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Proof</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map(sub => (
                                <tr key={sub.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ fontWeight: 600 }}>{sub.users?.full_name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub.users?.email}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ fontWeight: 500 }}>{sub.problems?.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub.problems?.platform} • {sub.problems?.difficulty}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <a href={sub.screenshot_url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
                                            <ExternalLink size={14} /> View
                                        </a>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '50px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            background: sub.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : sub.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: sub.status === 'approved' ? 'var(--success)' : sub.status === 'rejected' ? 'var(--error)' : 'var(--warning)',
                                        }}>
                                            {sub.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            {sub.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleStatusUpdate(sub.id, 'approved')} className="btn-secondary" style={{ padding: '0.4rem', color: 'var(--success)' }} title="Approve">
                                                        <FileCheck size={18} />
                                                    </button>
                                                    <button onClick={() => handleStatusUpdate(sub.id, 'rejected')} className="btn-secondary" style={{ padding: '0.4rem', color: 'var(--error)' }} title="Reject">
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            )}
                                            <button onClick={() => handleDeleteSubmission(sub.id)} className="btn-secondary" style={{ padding: '0.4rem', color: 'var(--text-muted)' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {isPatternFormOpen && <PatternForm onClose={() => { setIsPatternFormOpen(false); fetchAdminData(); }} />}
            {isProblemFormOpen && <ProblemForm onClose={() => { setIsProblemFormOpen(false); fetchAdminData(); }} />}
        </div>
    );
};

export default AdminDashboard;
