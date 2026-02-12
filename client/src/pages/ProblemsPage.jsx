import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Filter, Search, PlusCircle } from 'lucide-react';
import ProblemCard from '../components/user/ProblemCard';
import SubmissionForm from '../components/user/SubmissionForm';

const ProblemsPage = () => {
    const [searchParams] = useSearchParams();
    const patternId = searchParams.get('pattern_id');

    const [problems, setProblems] = useState([]);
    const [patterns, setPatterns] = useState([]);
    const [selectedPattern, setSelectedPattern] = useState(patternId || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);

    useEffect(() => {
        fetchData();
    }, [selectedPattern]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [problemsRes, patternsRes] = await Promise.all([
                api.get(`/problems${selectedPattern ? `?pattern_id=${selectedPattern}` : ''}`),
                api.get('/patterns')
            ]);
            setProblems(problemsRes.data);
            setPatterns(patternsRes.data);
        } catch (err) {
            console.error('Error fetching problems', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProblems = problems.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenForm = (problem) => {
        setSelectedProblem(problem);
        setIsFormOpen(true);
    };

    return (
        <div className="animate-fade">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Practice Problems</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Solve curated problems and track your progress.</p>
                </div>
            </header>

            {/* Filters */}
            <div className="card glass" style={{ marginBottom: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search problems..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: '2.75rem', width: '100%' }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Filter size={18} style={{ color: 'var(--text-muted)' }} />
                    <select
                        value={selectedPattern}
                        onChange={(e) => setSelectedPattern(e.target.value)}
                        style={{ minWidth: '200px' }}
                    >
                        <option value="">All Patterns</option>
                        {patterns.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>Loading problems...</div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                    {filteredProblems.length > 0 ? (
                        filteredProblems.map(problem => (
                            <ProblemCard
                                key={problem.id}
                                problem={problem}
                                onSolve={() => handleOpenForm(problem)}
                            />
                        ))
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            No problems found matching your criteria.
                        </div>
                    )}
                </div>
            )}

            {isFormOpen && (
                <SubmissionForm
                    problem={selectedProblem}
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={() => {
                        setIsFormOpen(false);
                        // Refresh logic if needed
                    }}
                />
            )}
        </div>
    );
};

export default ProblemsPage;
