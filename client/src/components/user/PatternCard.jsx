import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Layers } from 'lucide-react';

const PatternCard = ({ pattern, progress }) => {
    const solved = progress?.solved || 0;
    const total = progress?.total || 0;
    const percent = total > 0 ? Math.round((solved / total) * 100) : 0;

    return (
        <div className="card glass relative group h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-primary">
                    <Layers size={24} />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted bg-white/5 px-2 py-1 rounded-full">
                        {solved}/{total}
                    </span>
                    <Link to={`/problems?pattern_id=${pattern.id}`} className="btn btn-secondary p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                        <ChevronRight size={20} />
                    </Link>
                </div>
            </div>

            <h3 className="text-xl font-bold mb-2">{pattern.name}</h3>
            <p className="text-muted text-sm mb-6 line-clamp-2 flex-grow">
                {pattern.description || 'Master this algorithm pattern with curated challenges and real-world examples.'}
            </p>

            <div className="w-full h-1.5 bg-white/5 rounded-full mb-4 overflow-hidden">
                <div
                    className="h-full bg-success transition-all duration-500 ease-out"
                    style={{ width: `${percent}%` }}
                />
            </div>

            <div className="border-t border-white/10 pt-4 mt-auto flex justify-between items-center">
                <span className="text-xs text-muted">Created {new Date(pattern.created_at).toLocaleDateString()}</span>
                <Link to={`/problems?pattern_id=${pattern.id}`} className="text-sm font-semibold text-primary hover:text-accent flex items-center gap-1">
                    Explore Mode <ChevronRight size={14} />
                </Link>
            </div>
        </div>
    );
};

export default PatternCard;
