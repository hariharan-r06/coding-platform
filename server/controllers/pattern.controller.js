const supabase = require('../config/supabase');

const getAllPatterns = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('patterns')
            .select('*')
            .order('name');

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createPattern = async (req, res) => {
    try {
        const { name, description } = req.body;
        const { data, error } = await supabase
            .from('patterns')
            .insert([{ name, description, created_by: req.user.id }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePattern = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const { data, error } = await supabase
            .from('patterns')
            .update({ name, description, updated_at: new Date() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deletePattern = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('patterns')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ message: 'Pattern deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllPatterns,
    createPattern,
    updatePattern,
    deletePattern
};
