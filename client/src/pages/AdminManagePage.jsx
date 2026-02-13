import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import PatternForm from '../components/admin/PatternForm';
import ProblemForm from '../components/admin/ProblemForm';

const AdminManagePage = () => {
    const [problems, setProblems] = useState([]);
    const [patterns, setPatterns] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isPatternFormOpen, setIsPatternFormOpen] = useState(false);
    const [isProblemFormOpen, setIsProblemFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [problemsRes, patternsRes] = await Promise.all([
                api.get('/problems'),
                api.get('/patterns')
            ]);
            setProblems(problemsRes.data);
            setPatterns(patternsRes.data);
        } catch (err) {
            console.error('Error fetching admin content data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePattern = async (id) => {
        if (window.confirm('Delete this pattern? This might affect associated problems.')) {
            try {
                await api.delete(`/patterns/${id}`);
                fetchData();
            } catch (err) {
                console.error(err);
                alert('Error deleting pattern. It might be in use.');
            }
        }
    };

    const handleDeleteProblem = async (id) => {
        if (window.confirm('Delete this problem?')) {
            try {
                await api.delete(`/problems/${id}`);
                fetchData();
            } catch (err) {
                console.error(err);
                alert('Error deleting problem');
            }
        }
    };

    if (loading) return <div>Loading content manager...</div>;

    return (
        <div className="animate-fade">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl text-primary mb-1">Content Management</h1>
                    <p className="text-muted">Create and manage algorithms patterns and problems.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => { setEditingItem(null); setIsPatternFormOpen(true); }} className="btn btn-secondary text-sm">
                        <Plus size={18} /> New Pattern
                    </button>
                    <button onClick={() => { setEditingItem(null); setIsProblemFormOpen(true); }} className="btn btn-primary text-sm shadow-lg shadow-indigo-500/20">
                        <Plus size={18} /> Add Problem
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Patterns Management */}
                <section className="card glass">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl">Manage Patterns</h2>
                    </div>
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5 sticky top-0 backdrop-blur-md">
                                    <th className="p-3 text-sm font-semibold text-muted">Name</th>
                                    <th className="p-3 text-sm font-semibold text-muted text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patterns.map(pat => (
                                    <tr key={pat.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-3 font-medium text-white">{pat.name}</td>
                                        <td className="p-3 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => { setEditingItem(pat); setIsPatternFormOpen(true); }}
                                                    className="btn btn-sm btn-secondary p-1.5 text-info hover:text-white"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePattern(pat.id)}
                                                    className="btn btn-sm btn-secondary p-1.5 text-muted hover:text-error"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {patterns.length === 0 && <tr><td colSpan="2" className="p-4 text-center text-muted">No patterns found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Problems Management */}
                <section className="card glass">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl">Manage Problems</h2>
                    </div>
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5 sticky top-0 backdrop-blur-md">
                                    <th className="p-3 text-sm font-semibold text-muted">Title</th>
                                    <th className="p-3 text-sm font-semibold text-muted">Difficulty</th>
                                    <th className="p-3 text-sm font-semibold text-muted text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {problems.map(prob => (
                                    <tr key={prob.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-3">
                                            <div className="font-medium text-white">{prob.title}</div>
                                            <div className="text-xs text-muted">{prob.patterns?.name}</div>
                                        </td>
                                        <td className="p-3">
                                            <span className={`text-xs px-2 py-0.5 rounded ${prob.difficulty === 'Easy' ? 'bg-success/10 text-success' :
                                                    prob.difficulty === 'Medium' ? 'bg-warning/10 text-warning' :
                                                        'bg-error/10 text-error'
                                                }`}>
                                                {prob.difficulty}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => { setEditingItem(prob); setIsProblemFormOpen(true); }}
                                                    className="btn btn-sm btn-secondary p-1.5 text-info hover:text-white"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProblem(prob.id)}
                                                    className="btn btn-sm btn-secondary p-1.5 text-muted hover:text-error"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {problems.length === 0 && <tr><td colSpan="3" className="p-4 text-center text-muted">No problems found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {isPatternFormOpen && <PatternForm pattern={editingItem} onClose={() => { setIsPatternFormOpen(false); setEditingItem(null); fetchData(); }} />}
            {isProblemFormOpen && <ProblemForm problem={editingItem} onClose={() => { setIsProblemFormOpen(false); setEditingItem(null); fetchData(); }} />}
        </div>
    );
};

export default AdminManagePage;
