const { createClient } = require('@supabase/supabase-js');
const url = 'https://vyyrklyehbgylsynwyeh.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5eXJrbHllaGJneWxzeW53eWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDM0OTksImV4cCI6MjA4NjQ3OTQ5OX0.k2jgoZ53_ngO2HD6507aAofC_NUDG98ruydAP_rEf4M';
const supabase = createClient(url, key);

async function check() {
    const { error } = await supabase.from('users').select('id').limit(1);
    if (error) {
        console.log('CHECK_FAIL: ' + error.message);
    } else {
        console.log('CHECK_SUCCESS');
    }
}
check();
