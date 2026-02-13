const supabase = require('../config/supabase');

const getNotifications = async (req, res) => {
    try {
        const { id } = req.user;
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);

        if (error) throw error;
        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const { id } = req.user;
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', id);

        if (error) throw error;
        res.json({ message: 'All marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Helper function to create notification (internal use)
const createNotification = async (userId, type, title, message) => {
    try {
        await supabase
            .from('notifications')
            .insert([{
                user_id: userId,
                type,
                title,
                message,
                is_read: false
            }]);
    } catch (err) {
        console.error('Error creating notification:', err);
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    createNotification
};
