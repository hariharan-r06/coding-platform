const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

const getAllSubmissions = async (req, res) => {
    try {
        const { user_id, problem_id, pattern_id } = req.query;
        let query = supabase
            .from('submissions')
            .select('*, users(full_name, email), problems(title, platform, difficulty, patterns(name))');

        // Admin can see everything, users only see their own by default unless they specify user_id (which should be blocked if not admin)
        if (req.user.role !== 'admin') {
            query = query.eq('user_id', req.user.id);
        } else if (user_id) {
            query = query.eq('user_id', user_id);
        }

        if (problem_id) query = query.eq('problem_id', problem_id);

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        // Filter by pattern_id manually if provided (since it's nested deep)
        let filteredData = data;
        if (pattern_id) {
            filteredData = data.filter(s => s.problems.patterns.id === pattern_id);
        }

        res.json(filteredData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSubmissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('submissions')
            .select('*, users(full_name, email), problems(*, patterns(*))')
            .eq('id', id)
            .single();

        if (error) throw error;

        // Check if user has access
        if (req.user.role !== 'admin' && data.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createSubmission = async (req, res) => {
    try {
        const { problem_id, notes } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'Screenshot is required' });
        }

        // 1. Upload file to Supabase Storage
        const fileName = `${req.user.id}/${uuidv4()}-${file.originalname}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('submission-screenshots')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (uploadError) throw uploadError;

        // 2. Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('submission-screenshots')
            .getPublicUrl(fileName);

        // 3. Save to database
        const { data, error } = await supabase
            .from('submissions')
            .insert([{
                user_id: req.user.id,
                problem_id,
                notes,
                screenshot_url: publicUrl,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) {
            // Cleanup uploaded file if DB insert fails
            await supabase.storage.from('submission-screenshots').remove([fileName]);
            throw error;
        }

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const file = req.file;

        // Check ownership
        const { data: submission } = await supabase
            .from('submissions')
            .select('user_id, screenshot_url')
            .eq('id', id)
            .single();

        if (!submission || submission.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        let updateData = { notes, updated_at: new Date() };

        if (file) {
            // Handle new file upload
            const fileName = `${req.user.id}/${uuidv4()}-${file.originalname}`;
            const { error: uploadError } = await supabase.storage
                .from('submission-screenshots')
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('submission-screenshots')
                .getPublicUrl(fileName);

            updateData.screenshot_url = publicUrl;

            // Optional: delete old file
            const oldFileName = submission.screenshot_url.split('/').pop();
            if (oldFileName) {
                await supabase.storage.from('submission-screenshots').remove([`${req.user.id}/${oldFileName}`]);
            }
        }

        const { data, error } = await supabase
            .from('submissions')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteSubmission = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: submission } = await supabase
            .from('submissions')
            .select('user_id, screenshot_url')
            .eq('id', id)
            .single();

        if (!submission) return res.status(404).json({ error: 'Submission not found' });

        if (req.user.role !== 'admin' && submission.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        const { error } = await supabase.from('submissions').delete().eq('id', id);
        if (error) throw error;

        // Cleanup storage
        const oldFileName = submission.screenshot_url.split('/').pop();
        if (oldFileName) {
            await supabase.storage.from('submission-screenshots').remove([`${req.user.id}/${oldFileName}`]);
        }

        res.json({ message: 'Submission deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const { data, error } = await supabase
            .from('submissions')
            .update({ status, updated_at: new Date() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllSubmissions,
    getSubmissionById,
    createSubmission,
    updateSubmission,
    deleteSubmission,
    updateStatus
};
