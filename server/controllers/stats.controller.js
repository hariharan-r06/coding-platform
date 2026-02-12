const supabase = require('../config/supabase');

const getUserStats = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check permissions
        if (req.user.role !== 'admin' && req.user.id !== userId) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        // 1. Get ALL problems to calculate totals
        const { data: allProblems, error: probError } = await supabase
            .from('problems')
            .select('id, difficulty, pattern_id, patterns(id, name)');

        if (probError) throw probError;

        // Calculate Totals Map
        const totalStats = {
            total: allProblems.length,
            by_difficulty: {},
            by_pattern_id: {} // Key by ID
        };

        allProblems.forEach(p => {
            // Difficulty Totals
            const diff = p.difficulty || 'Unknown';
            totalStats.by_difficulty[diff] = (totalStats.by_difficulty[diff] || 0) + 1;

            // Pattern Totals
            const patId = p.pattern_id;
            const patName = p.patterns?.name || 'Unknown Pattern';

            if (patId) {
                if (!totalStats.by_pattern_id[patId]) {
                    totalStats.by_pattern_id[patId] = { total: 0, name: patName };
                }
                totalStats.by_pattern_id[patId].total += 1;
            }
        });

        // 2. Get SOLVED submissions (approved)
        // Fetch pattern_id directly from the joined problem to ensure accurate linking
        const { data: solvedSubs, error: solveError } = await supabase
            .from('submissions')
            .select('problem_id, problems(difficulty, pattern_id)')
            .eq('user_id', userId)
            .eq('status', 'approved');

        if (solveError) throw solveError;

        // Calculate Solved Counts (Unique problems only)
        const solvedSet = new Set(); // To avoid double counting multiple submissions for same problem
        const solvedStats = {
            total: 0,
            by_difficulty: {},
            by_pattern_id: {}
        };

        solvedSubs.forEach(sub => {
            if (!sub.problems) return;
            if (solvedSet.has(sub.problem_id)) return;
            solvedSet.add(sub.problem_id);

            solvedStats.total += 1;

            // Difficulty Solved
            const diff = sub.problems.difficulty || 'Unknown';
            solvedStats.by_difficulty[diff] = (solvedStats.by_difficulty[diff] || 0) + 1;

            // Pattern Solved
            const patId = sub.problems.pattern_id;
            if (patId) {
                solvedStats.by_pattern_id[patId] = (solvedStats.by_pattern_id[patId] || 0) + 1;
            }
        });

        // 3. Construct Final Response
        const response = {
            overview: {
                solved: solvedStats.total,
                total: totalStats.total,
                percentage: totalStats.total > 0 ? Math.round((solvedStats.total / totalStats.total) * 100) : 0
            },
            difficulty_breakdown: Object.keys(totalStats.by_difficulty).map(diff => ({
                label: diff,
                solved: solvedStats.by_difficulty[diff] || 0,
                total: totalStats.by_difficulty[diff],
                percentage: Math.round(((solvedStats.by_difficulty[diff] || 0) / totalStats.by_difficulty[diff]) * 100)
            })),
            pattern_breakdown: Object.keys(totalStats.by_pattern_id).map(patId => {
                const totalInfo = totalStats.by_pattern_id[patId];
                const solvedCount = solvedStats.by_pattern_id[patId] || 0;
                return {
                    name: totalInfo.name,
                    id: patId,
                    solved: solvedCount,
                    total: totalInfo.total,
                    percentage: totalInfo.total > 0 ? Math.round((solvedCount / totalInfo.total) * 100) : 0
                };
            })
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getLeaderboard = async (req, res) => {
    try {
        // This is a bit complex in Supabase without custom RPC
        // We'll get all users and their approved submission counts
        const { data, error } = await supabase
            .from('users')
            .select('id, full_name, email, submissions(count)')
            .eq('submissions.status', 'approved');

        if (error) throw error;

        // Supabase nested count might be tricky, let's do a more robust approach if needed
        // For now, simpler approach:
        const leaderboard = data
            .map(user => ({
                id: user.id,
                full_name: user.full_name,
                solved_count: user.submissions?.[0]?.count || 0
            }))
            .sort((a, b) => b.solved_count - a.solved_count);

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUserStats,
    getLeaderboard
};
