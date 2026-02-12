import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { X, Check, Loader2 } from 'lucide-react';

const ProblemForm = ({ problem = null, onClose }) => {
    const [formData, setFormData] = useState({
        title: problem?.title || '',
        problem_link: problem?.problem_link || '',
        youtube_url: problem?.youtube_url || '',
        pattern_id: problem?.pattern_id || '',
        difficulty: problem?.difficulty || 'Easy',
        platform: problem?.platform || 'LeetCode'
    });
    const [patterns, setPatterns] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatterns = async () => {
            try {
                const res = await api.get('/patterns');
                setPatterns(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPatterns();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.pattern_id) {
            setError('Please select a pattern');
            return;
        }
        setIsSubmitting(true);
        try {
            if (problem) {
                await api.put(`/problems/${problem.id}`, formData);
            } else {
                await api.post('/problems', formData);
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save problem');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
            <div className="card glass animate-fade" style={{ width: '100%', maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{problem ? 'Edit Problem' : 'Add New Problem'}</h2>
                    <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}><X size={24} /></button>
                </div>

                {error && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Problem Title</label>
                        <input
                            type="text"
                            placeholder="e.g., Two Sum"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            style={{ width: '100%' }}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Problem URL</label>
                        <input
                            type="url"
                            placeholder="https://leetcode.com/problems/..."
                            value={formData.problem_link}
                            onChange={(e) => setFormData({ ...formData, problem_link: e.target.value })}
                            style={{ width: '100%' }}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>YouTube Solution (Optional)</label>
                        <input
                            type="url"
                            placeholder="https://youtube.com/watch?v=..."
                            value={formData.youtube_url || ''}
                            onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Pattern</label>
                            <select
                                value={formData.pattern_id}
                                onChange={(e) => setFormData({ ...formData, pattern_id: e.target.value })}
                                style={{ width: '100%' }}
                                required
                            >
                                <option value="">Select Pattern</option>
                                {patterns.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Platform</label>
                            <select
                                value={formData.platform}
                                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                style={{ width: '100%' }}
                            >
                                <option value="LeetCode">LeetCode</option>
                                <option value="GeeksforGeeks">GeeksforGeeks</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Difficulty</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {['Easy', 'Medium', 'Hard'].map(diff => (
                                <label key={diff} style={{ flex: 1, cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="difficulty"
                                        value={diff}
                                        checked={formData.difficulty === diff}
                                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                        style={{ position: 'absolute', opacity: 0 }}
                                    />
                                    <div style={{
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        textAlign: 'center',
                                        border: '1px solid var(--border)',
                                        background: formData.difficulty === diff ? 'var(--primary)' : 'var(--surface)',
                                        color: formData.difficulty === diff ? 'white' : 'var(--text)',
                                        transition: 'all 0.2s ease'
                                    }}>
                                        {diff}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 2 }}>
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Check size={20} /> {problem ? 'Update' : 'Add'} Problem</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProblemForm;
