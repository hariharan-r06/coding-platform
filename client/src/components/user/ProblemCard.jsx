import React from 'react';
import { ExternalLink, CheckCircle2, Circle } from 'lucide-react';

const ProblemCard = ({ problem, onSolve }) => {
    const getDifficultyColor = (diff) => {
        switch (diff?.toLowerCase()) {
            case 'easy': return 'var(--success)';
            case 'medium': return 'var(--warning)';
            case 'hard': return 'var(--error)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div className="card glass" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '50px',
                    background: 'rgba(255,255,255,0.05)',
                    color: getDifficultyColor(problem.difficulty),
                    border: `1px solid ${getDifficultyColor(problem.difficulty)}22`
                }}>
                    {problem.difficulty}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{problem.platform}</span>
            </div>

            <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{problem.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Pattern: <span style={{ color: 'var(--text)' }}>{problem.patterns?.name}</span>
                </p>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                <a
                    href={problem.problem_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ flex: 1, textDecoration: 'none' }}
                >
                    <ExternalLink size={16} /> Solve
                </a>
                <button
                    onClick={onSolve}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default ProblemCard;
