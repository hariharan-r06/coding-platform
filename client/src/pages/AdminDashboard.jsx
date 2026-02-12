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
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl text-primary mb-1">Admin Control Center</h1>
                    <p className="text-muted">Manage patterns, problems, and review student work.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setIsPatternFormOpen(true)} className="btn btn-secondary text-sm">
                        <Plus size={18} /> New Pattern
                    </button>
                    <button onClick={() => setIsProblemFormOpen(true)} className="btn btn-primary text-sm shadow-lg shadow-indigo-500/20">
                        <Plus size={18} /> Add Problem
                    </button>
                </div>
            </header>

            {/* Admin Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="card stat-card glass">
                    <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{stats.total_users}</div>
                        <div className="text-sm text-muted">Active Students</div>
                    </div>
                </div>

                <div className="card stat-card glass">
                    <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{stats.pending_submissions}</div>
                        <div className="text-sm text-muted">Pending Reviews</div>
                    </div>
                </div>

                <div className="card stat-card glass">
                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                        <FileCheck size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{stats.total_problems}</div>
                        <div className="text-sm text-muted">Total Problems</div>
                    </div>
                </div>
            </div>

            {/* Submissions Review Table */}
            <section>
                <h2 className="text-xl mb-6">Submissions Review</h2>
                <div className="card glass p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="p-4 text-sm font-semibold text-muted">Student</th>
                                    <th className="p-4 text-sm font-semibold text-muted">Problem</th>
                                    <th className="p-4 text-sm font-semibold text-muted">Proof</th>
                                    <th className="p-4 text-sm font-semibold text-muted">Status</th>
                                    <th className="p-4 text-sm font-semibold text-muted text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map(sub => (
                                    <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold text-white">{sub.users?.full_name}</div>
                                            <div className="text-xs text-muted">{sub.users?.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-white">{sub.problems?.title}</div>
                                            <div className="text-xs text-muted">{sub.problems?.platform} • {sub.problems?.difficulty}</div>
                                        </td>
                                        <td className="p-4">
                                            <a href={sub.screenshot_url} target="_blank" rel="noreferrer" className="text-primary hover:text-accent flex items-center gap-1 text-sm font-medium">
                                                <ExternalLink size={14} /> View
                                            </a>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                                                ${sub.status === 'approved' ? 'bg-green-500/10 text-success' :
                                                    sub.status === 'rejected' ? 'bg-red-500/10 text-error' :
                                                        'bg-amber-500/10 text-warning'}`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex gap-2 justify-end">
                                                {sub.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => handleStatusUpdate(sub.id, 'approved')} className="btn btn-secondary p-2 text-success hover:bg-green-500/10 border-green-500/20" title="Approve">
                                                            <FileCheck size={18} />
                                                        </button>
                                                        <button onClick={() => handleStatusUpdate(sub.id, 'rejected')} className="btn btn-secondary p-2 text-error hover:bg-red-500/10 border-red-500/20" title="Reject">
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button onClick={() => handleDeleteSubmission(sub.id)} className="btn btn-secondary p-2 text-muted hover:text-error hover:border-error transition-colors" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {submissions.length === 0 && (
                            <div className="p-8 text-center text-muted">No submissions found.</div>
                        )}
                    </div>
                </div>
            </section>

            {isPatternFormOpen && <PatternForm onClose={() => { setIsPatternFormOpen(false); fetchAdminData(); }} />}
            {isProblemFormOpen && <ProblemForm onClose={() => { setIsProblemFormOpen(false); fetchAdminData(); }} />}
        </div>
    );
};

export default AdminDashboard;
