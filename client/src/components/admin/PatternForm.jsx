import React, { useState } from 'react';
import api from '../../services/api';
import { X, Check, Loader2 } from 'lucide-react';

const PatternForm = ({ pattern = null, onClose }) => {
    const [formData, setFormData] = useState({
        name: pattern?.name || '',
        description: pattern?.description || ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (pattern) {
                await api.put(`/patterns/${pattern.id}`, formData);
            } else {
                await api.post('/patterns', formData);
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save pattern');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
            <div className="card glass animate-fade" style={{ width: '100%', maxWidth: '500px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{pattern ? 'Edit Pattern' : 'New Pattern'}</h2>
                    <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}><X size={24} /></button>
                </div>

                {error && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Pattern Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Two Pointers"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: '100%' }}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                        <textarea
                            placeholder="Describe this pattern..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            style={{ width: '100%', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 2 }}>
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Check size={20} /> {pattern ? 'Update' : 'Create'} Pattern</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatternForm;
