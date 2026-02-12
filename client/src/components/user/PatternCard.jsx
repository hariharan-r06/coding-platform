import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Layers } from 'lucide-react';

const PatternCard = ({ pattern }) => {
    return (
        <div className="card glass" style={{ transition: 'transform 0.2s ease', cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.75rem', borderRadius: 'var(--radius)' }}>
                    <Layers size={24} />
                </div>
                <Link to={`/problems?pattern_id=${pattern.id}`} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                    <ChevronRight size={20} />
                </Link>
            </div>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{pattern.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {pattern.description || 'Master this algorithm pattern with curated challenges and real-world examples.'}
            </p>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Created {new Date(pattern.created_at).toLocaleDateString()}</span>
                <Link to={`/problems?pattern_id=${pattern.id}`} style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>Explore Mode</Link>
            </div>
        </div>
    );
};

export default PatternCard;
