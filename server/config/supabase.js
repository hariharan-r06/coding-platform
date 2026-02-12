const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your-supabase-url') {
    console.warn('Supabase credentials are not set. Please update your server/.env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
