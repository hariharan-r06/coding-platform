const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database to ensure they still exist and get their role
        const { data: user, error } = await supabase
            .from('users')
            .select('id, email, full_name, role')
            .eq('id', decoded.id)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied: Admin rights required' });
    }
};

module.exports = { authMiddleware, adminOnly };
