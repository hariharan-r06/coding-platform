const supabase = require('../config/supabase');

const getAllProblems = async (req, res) => {
    try {
        const { pattern_id } = req.query;
        let query = supabase.from('problems').select('*, patterns(name)');

        if (pattern_id) {
            query = query.eq('pattern_id', pattern_id);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProblemById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('problems')
            .select('*, patterns(name)')
            .eq('id', id)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProblem = async (req, res) => {
    try {
        const { title, problem_link, youtube_url, our_video_url, pattern_id, difficulty, platform } = req.body;
        const { data, error } = await supabase
            .from('problems')
            .insert([{
                title,
                problem_link,
                youtube_url,
                our_video_url,
                pattern_id,
                difficulty,
                platform,
                created_by: req.user.id
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, problem_link, youtube_url, our_video_url, pattern_id, difficulty, platform } = req.body;
        const { data, error } = await supabase
            .from('problems')
            .update({
                title,
                problem_link,
                youtube_url,
                our_video_url,
                pattern_id,
                difficulty,
                platform,
                updated_at: new Date()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('problems')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ message: 'Problem deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllProblems,
    getProblemById,
    createProblem,
    updateProblem,
    deleteProblem
};
