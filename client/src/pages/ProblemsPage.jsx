import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Filter, Search, ChevronDown, ChevronRight, CheckCircle, Youtube } from 'lucide-react';
import SubmissionForm from '../components/user/SubmissionForm';

const ProblemsPage = () => {
    const [searchParams] = useSearchParams();
    const initialPatternId = searchParams.get('pattern_id');

    const [problems, setProblems] = useState([]);
    const [patterns, setPatterns] = useState([]);
    const [userSubmissions, setUserSubmissions] = useState({}); // problemId -> status/date
    const [expandedPatterns, setExpandedPatterns] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);

    const { user } = useAuth(); // Assuming there's a useAuth hook context available

    useEffect(() => {
        fetchData();
    }, []);

    // Effect to expand the pattern from query param initially
    useEffect(() => {
        if (initialPatternId) {
            setExpandedPatterns(prev => ({ ...prev, [initialPatternId]: true }));
        }
    }, [initialPatternId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [problemsRes, patternsRes, submissionsRes] = await Promise.all([
                api.get('/problems'), // Fetch ALL problems initially
                api.get('/patterns'),
                api.get('/submissions') // Fetch user's submissions to determine status
            ]);

            setProblems(problemsRes.data);
            setPatterns(patternsRes.data);

            // Map submissions for easy lookup: problem_id -> { status, updated_at }
            const subsMap = {};
            submissionsRes.data.forEach(sub => {
                // If multiple, maybe capture the latest approved or just the latest? 
                // Assumes backend returns sorted or we just take one. Use approved if available.
                // For simplicity, overwriting to store latest status found in list from API
                if (!subsMap[sub.problem_id] || sub.status === 'approved') {
                    subsMap[sub.problem_id] = { status: sub.status, date: sub.created_at };
                }
            });
            setUserSubmissions(subsMap);

        } catch (err) {
            console.error('Error fetching problems data', err);
        } finally {
            setLoading(false);
        }
    };

    const togglePattern = (patternId) => {
        setExpandedPatterns(prev => ({
            ...prev,
            [patternId]: !prev[patternId]
        }));
    };

    const handleOpenForm = (problem) => {
        setSelectedProblem(problem);
        setIsFormOpen(true);
    };

    // Group problems by pattern_id
    const problemsByPattern = problems.reduce((acc, prob) => {
        const pId = prob.pattern_id || 'other';
        if (!acc[pId]) acc[pId] = [];
        acc[pId].push(prob);
        return acc;
    }, {});

    // Filter patterns based on search query matching problems or pattern name
    const filteredPatterns = patterns.filter(pattern => {
        const patternProblems = problemsByPattern[pattern.id] || [];
        const matchesPatternName = pattern.name.toLowerCase().includes(searchQuery.toLowerCase());
        const hasMatchingProblem = patternProblems.some(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesPatternName || hasMatchingProblem;
    });

    // Auto-expand patterns if searching
    useEffect(() => {
        if (searchQuery) {
            const newExpanded = {};
            filteredPatterns.forEach(p => newExpanded[p.id] = true);
            setExpandedPatterns(newExpanded);
        }
    }, [searchQuery]);

    const getDifficultyColor = (diff) => {
        switch (diff?.toLowerCase()) {
            case 'easy': return 'var(--success)';
            case 'medium': return 'var(--warning)';
            case 'hard': return 'var(--error)';
            default: return 'var(--text-muted)';
        }
    };

    const getStatusBadge = (probId) => {
        const sub = userSubmissions[probId];
        if (!sub) return <span className="text-muted text-xs">—</span>;

        let color = 'var(--text-muted)';
        let text = 'Pending';

        if (sub.status === 'approved') {
            color = 'var(--success)';
            text = 'Solved';
        } else if (sub.status === 'rejected') {
            color = 'var(--error)';
            text = 'Rejected';
        } else {
            color = 'var(--warning)';
        }

        return (
            <span style={{
                color,
                background: `${color}1A`, // 10% opacity hex
                padding: '0.25rem 0.75rem',
                borderRadius: '99px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: `1px solid ${color}33`
            }}>
                {text}
            </span>
        );
    };

    return (
        <div className="animate-fade">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Practice Problems</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Master algorithms pattern by pattern.</p>
                </div>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search problems or patterns..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: '2.75rem', width: '100%' }}
                    />
                </div>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>Loading content...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredPatterns.map(pattern => {
                        const patternProblems = problemsByPattern[pattern.id] || [];
                        // Sort problems: Solved status might be interesting, but usually ID or difficulty?
                        // Let's sort by difficulty: Easy -> Medium -> Hard
                        const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                        patternProblems.sort((a, b) => (diffOrder[a.difficulty] || 99) - (diffOrder[b.difficulty] || 99));

                        // If searching and this pattern has no matching problems (only matched name), show all.
                        // If searching and has matching problems, maybe show all or just matches? Let's show all for context.

                        if (patternProblems.length === 0) return null;

                        const isExpanded = expandedPatterns[pattern.id];
                        const solvedCount = patternProblems.filter(p => userSubmissions[p.id]?.status === 'approved').length;

                        return (
                            <div key={pattern.id} className="card glass" style={{ padding: 0, overflow: 'hidden' }}>
                                {/* Accordion Header */}
                                <div
                                    onClick={() => togglePattern(pattern.id)}
                                    style={{
                                        padding: '1.25rem 1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        background: isExpanded ? 'rgba(255,255,255,0.03)' : 'transparent',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            background: isExpanded ? 'var(--primary)' : 'var(--surface-light)',
                                            color: isExpanded ? '#000' : 'var(--text)',
                                            width: '2rem', height: '2rem',
                                            borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 'bold', fontSize: '0.85rem',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{pattern.name}</h3>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                {solvedCount} / {patternProblems.length} Solved
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ width: '100px', height: '6px', background: 'var(--surface-light)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ width: `${(solvedCount / patternProblems.length) * 100}%`, background: 'var(--success)', height: '100%' }} />
                                    </div>
                                </div>

                                {/* Accordion Body (Table) */}
                                {isExpanded && (
                                    <div style={{ borderTop: '1px solid var(--border)', overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                                            <thead>
                                                <tr style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Status</th>
                                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Problem</th>
                                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Difficulty</th>
                                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Solution</th>
                                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Submit</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patternProblems.map(prob => (
                                                    <tr key={prob.id} className="hover:bg-white/5 transition-colors">
                                                        <td style={{ padding: '1rem 1.5rem' }}>
                                                            {userSubmissions[prob.id]?.status === 'approved' ?
                                                                <CheckCircle size={18} color="var(--success)" /> :
                                                                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--border)' }} />
                                                            }
                                                        </td>
                                                        <td style={{ padding: '1rem 1.5rem' }}>
                                                            <div style={{ fontWeight: 500, color: 'var(--text)' }}>
                                                                <a href={prob.problem_link} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                                                                    {prob.title}
                                                                </a>
                                                            </div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{prob.platform}</div>
                                                        </td>
                                                        <td style={{ padding: '1rem 1.5rem' }}>
                                                            <span style={{ color: getDifficultyColor(prob.difficulty), fontWeight: 500 }}>
                                                                {prob.difficulty}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '1rem 1.5rem' }}>
                                                            {prob.youtube_url ? (
                                                                <a href={prob.youtube_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none' }} className="hover:text-error transition-colors">
                                                                    <Youtube size={20} color="var(--error)" />
                                                                    <span style={{ fontSize: '0.85rem' }}>Watch</span>
                                                                </a>
                                                            ) : (
                                                                <span style={{ color: 'var(--border)', fontSize: '0.85rem' }}>N/A</span>
                                                            )}
                                                        </td>
                                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
                                                                {/* Last submitted date if exists */}
                                                                {userSubmissions[prob.id] && (
                                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                        {new Date(userSubmissions[prob.id].date).toLocaleDateString()}
                                                                    </span>
                                                                )}
                                                                <button
                                                                    onClick={() => handleOpenForm(prob)}
                                                                    className="btn btn-secondary"
                                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                                >
                                                                    {userSubmissions[prob.id] ? 'Resubmit' : 'Solve'}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {isFormOpen && (
                <SubmissionForm
                    problem={selectedProblem}
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={() => {
                        setIsFormOpen(false);
                        fetchData(); // Refresh to update status
                    }}
                />
            )}
        </div>
    );
};

export default ProblemsPage;
