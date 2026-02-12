import React, { useState } from 'react';
import api from '../../services/api';
import { X, Upload, Check, Loader2 } from 'lucide-react';

const SubmissionForm = ({ problem, onClose, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload a screenshot');
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('problem_id', problem.id);
        formData.append('screenshot', file);
        formData.append('notes', notes);

        try {
            await api.post('/submissions', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.error || 'Submission failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
            <div className="card glass animate-fade" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Register Submission</h2>
                    <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}><X size={24} /></button>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{problem.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{problem.platform} • {problem.difficulty}</p>
                </div>

                {error && (
                    <div style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>Screenshot Proof</label>
                        <div
                            style={{
                                border: '2px dashed var(--border)',
                                borderRadius: 'var(--radius)',
                                padding: '2rem',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                background: preview ? 'none' : 'rgba(255,255,255,0.02)'
                            }}
                        >
                            {preview ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={preview} alt="Upload Preview" style={{ width: '100%', borderRadius: 'var(--radius)', maxHeight: '300px', objectFit: 'contain' }} />
                                    <button
                                        type="button"
                                        onClick={() => { setFile(null); setPreview(null); }}
                                        style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '0.25rem', borderRadius: '50%' }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div onClick={() => document.getElementById('file-upload').click()} style={{ cursor: 'pointer' }}>
                                    <Upload size={40} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                                    <p>Click or drag to upload screenshot</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Supports PNG, JPG up to 5MB</p>
                                </div>
                            )}
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>Notes (Optional)</label>
                        <textarea
                            placeholder="Any comments about your solution..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                            style={{ width: '100%', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 2 }}>
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Check size={20} /> Submit Solution</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmissionForm;
