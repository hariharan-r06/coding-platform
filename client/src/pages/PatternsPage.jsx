import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PatternCard from '../components/user/PatternCard';

const PatternsPage = () => {
    const [patterns, setPatterns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatterns = async () => {
            try {
                const res = await api.get('/patterns');
                setPatterns(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatterns();
    }, []);

    return (
        <div className="animate-fade">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Algorithm Patterns</h1>
                <p style={{ color: 'var(--text-muted)' }}>Browse through common problem-solving patterns and master them.</p>
            </header>

            {loading ? (
                <div>Loading patterns...</div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                    {patterns.map(pattern => (
                        <PatternCard key={pattern.id} pattern={pattern} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatternsPage;
