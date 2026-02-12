const supabase = require('../config/supabase');

const getUserStats = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check permissions: users can only see their own stats unless they're admin
        if (req.user.role !== 'admin' && req.user.id !== userId) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        // 1. Get total solved (approved submissions)
        const { count: total_solved, error: solveError } = await supabase
            .from('submissions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('status', 'approved');

        if (solveError) throw solveError;

        // 2. Get stats by pattern
        const { data: byPattern, error: patternError } = await supabase
            .from('submissions')
            .select('status, problems(pattern_id, patterns(name))')
            .eq('user_id', userId)
            .eq('status', 'approved');

        if (patternError) throw patternError;

        const patternStats = byPattern.reduce((acc, curr) => {
            const patternName = curr.problems.patterns.name;
            acc[patternName] = (acc[patternName] || 0) + 1;
            return acc;
        }, {});

        // 3. Get stats by difficulty
        const { data: byDifficulty, error: diffError } = await supabase
            .from('submissions')
            .select('status, problems(difficulty)')
            .eq('user_id', userId)
            .eq('status', 'approved');

        if (diffError) throw diffError;

        const difficultyStats = byDifficulty.reduce((acc, curr) => {
            const diff = curr.problems.difficulty;
            acc[diff] = (acc[diff] || 0) + 1;
            return acc;
        }, {});

        res.json({
            total_solved: total_solved || 0,
            by_pattern: Object.entries(patternStats).map(([name, count]) => ({ name, count })),
            by_difficulty: Object.entries(difficultyStats).map(([name, count]) => ({ name, count }))
        });
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
