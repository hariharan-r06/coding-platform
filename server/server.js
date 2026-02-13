require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const patternRoutes = require('./routes/pattern.routes');
const problemRoutes = require('./routes/problem.routes');
const submissionRoutes = require('./routes/submission.routes');
const statsRoutes = require('./routes/stats.routes');

const app = express();

// Middleware
// Parse allowed origins from env or use defaults
const allowedOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map(url => url.trim())
    .filter(Boolean);

// Default fallbacks if env is empty
if (allowedOrigins.length === 0) {
    allowedOrigins.push('http://localhost:5173');
}

// Add Vercel app explicitly if not in env
if (!allowedOrigins.includes('https://place-agurom.vercel.app')) {
    allowedOrigins.push('https://place-agurom.vercel.app');
}

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patterns', patternRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/notifications', require('./routes/notification.routes'));

// Root route
app.get('/', (req, res) => {
    res.send('<h1>CodePractice API</h1><p>The server is running! Access the frontend at <a href="http://localhost:5173">localhost:5173</a>.</p>');
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    console.log(`Uncaught Exception: ${err.message}`);
    // server.close(() => process.exit(1));
});
