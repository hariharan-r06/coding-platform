import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, Loader2 } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localError, setLocalError] = useState('');

    const { register, error } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (formData.password !== formData.confirmPassword) {
            return setLocalError('Passwords do not match');
        }

        setIsSubmitting(true);
        try {
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
            navigate('/');
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '1rem' }}>
            <div className="card glass animate-fade" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Start Practicing</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Create an account to track your progress</p>
                </div>

                {(error || localError) && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', color: 'var(--error)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                        {error || localError}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                name="full_name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.full_name}
                                onChange={handleChange}
                                style={{ paddingLeft: '2.75rem', width: '100%' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                style={{ paddingLeft: '2.75rem', width: '100%' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                style={{ paddingLeft: '2.75rem', width: '100%' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                style={{ paddingLeft: '2.75rem', width: '100%' }}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', marginTop: '1rem' }}>
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><UserPlus size={20} /> Create Account</>}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
