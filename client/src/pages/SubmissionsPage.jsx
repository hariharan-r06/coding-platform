import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { History, Search, Filter, Trash2, ExternalLink } from 'lucide-react';

const SubmissionsPage = () => {
    const { user, isAdmin } = useAuth();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetchSubmissions();
    }, [filterStatus]);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/submissions${filterStatus ? `?status=${filterStatus}` : ''}`);
            setSubmissions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/submissions/${id}`);
                fetchSubmissions();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    return (
        <div className="animate-fade">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Submission History</h1>
                    <p style={{ color: 'var(--text-muted)' }}>{isAdmin ? 'Review all student submissions.' : 'Track your practice history and status.'}</p>
                </div>
            </header>

            <div className="card glass" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <button
                    onClick={() => setFilterStatus('')}
                    className={filterStatus === '' ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                    All
                </button>
                <button
                    onClick={() => setFilterStatus('approved')}
                    className={filterStatus === 'approved' ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                    Approved
                </button>
                <button
                    onClick={() => setFilterStatus('pending')}
                    className={filterStatus === 'pending' ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                    Pending
                </button>
            </div>

            {loading ? (
                <div>Loading submissions...</div>
            ) : (
                <div className="grid">
                    {submissions.length > 0 ? (
                        submissions.map(sub => (
                            <div key={sub.id} className="card glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius)' }}>
                                        <History size={24} style={{ color: 'var(--primary)' }} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{sub.problems?.title}</h3>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                            Submitted on {new Date(sub.created_at).toLocaleDateString()} • {sub.problems?.platform}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                    <div style={{ textAlign: 'right' }}>
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
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <a href={sub.screenshot_url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                                            <ExternalLink size={18} />
                                        </a>
                                        {(isAdmin || sub.status === 'pending') && (
                                            <button onClick={() => handleDelete(sub.id)} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%', color: 'var(--error)' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            No submissions found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SubmissionsPage;
