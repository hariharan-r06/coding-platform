const supabase = require('./config/supabase');

async function test() {
    console.log('Testing connection...');
    try {
        const { data, error } = await supabase.from('users').select('*').limit(1);
        if (error) {
            console.error('Supabase Error:', error.message);
            if (error.code === '42P01') {
                console.error('HINT: It looks like the "users" table does not exist. Did you run the SQL script?');
            }
        } else {
            console.log('Connection successful! Table "users" exists.');
        }
    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
}

test();
