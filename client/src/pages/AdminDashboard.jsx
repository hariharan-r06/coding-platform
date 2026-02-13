import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, FileCheck, AlertCircle, ExternalLink, Trash2, X } from 'lucide-react';

const AdminDashboard = () => {
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState({ total_users: 0, pending_submissions: 0, total_problems: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [isReviewOpen, setIsReviewOpen] = useState(false);

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

    const openReview = (submission) => {
        setSelectedSubmission(submission);
        setAdminNotes(submission.admin_notes || '');
        setIsReviewOpen(true);
    };

    const handleReviewSubmit = async (status) => {
        if (!selectedSubmission) return;
        try {
            await api.patch(`/submissions/${selectedSubmission.id}/status`, {
                status,
                admin_notes: adminNotes
            });
            setIsReviewOpen(false);
            fetchAdminData();
        } catch (err) {
            alert('Error updating submission');
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
                    <p className="text-muted">Overview of platform statistics and submission reviews.</p>
                </div>
            </header>

            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <section className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl">Submissions Review</h2>
                </div>
                <div className="card glass p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="p-4 text-sm font-semibold text-muted">Student</th>
                                    <th className="p-4 text-sm font-semibold text-muted">Problem</th>
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
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                                                ${sub.status === 'approved' ? 'bg-green-500/10 text-success' :
                                                    sub.status === 'rejected' ? 'bg-red-500/10 text-error' :
                                                        'bg-amber-500/10 text-warning'}`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => openReview(sub)}
                                                    className="btn btn-primary p-2 px-4 text-xs"
                                                >
                                                    Review
                                                </button>
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

            {/* Review Modal */}
            {isReviewOpen && selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="card glass w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col gap-6 animate-fade">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl mb-1">Review Submission</h2>
                                <p className="text-muted text-sm">
                                    {selectedSubmission.users?.full_name} • {selectedSubmission.problems?.title}
                                </p>
                            </div>
                            <button onClick={() => setIsReviewOpen(false)} className="text-muted hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="bg-black/40 rounded-lg p-4 flex flex-col items-center gap-3 border border-white/5">
                            <div className="text-sm text-muted">Screenshot Proof</div>
                            <a
                                href={selectedSubmission.screenshot_url}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-primary flex items-center gap-2"
                            >
                                <ExternalLink size={18} />
                                View Screenshot
                            </a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-muted">Student Notes</label>
                                <div className="p-3 bg-white/5 rounded-lg text-sm min-h-[80px]">
                                    {selectedSubmission.notes || <span className="text-muted italic">No notes provided.</span>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-primary">Admin Feedback</label>
                                <textarea
                                    className="w-full bg-surface border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none min-h-[80px]"
                                    placeholder="Write feedback for the student..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-white/5">
                            <button
                                onClick={() => handleReviewSubmit('rejected')}
                                className="flex-1 btn bg-red-500/10 text-error hover:bg-red-500/20 border-transparent"
                            >
                                <X size={18} /> Reject
                            </button>
                            <button
                                onClick={() => handleReviewSubmit('approved')}
                                className="flex-1 btn btn-primary"
                            >
                                <FileCheck size={18} /> Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
