const axios = require('axios');

async function testRegister() {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            email: 'test' + Math.random() + '@example.com',
            password: 'Password123!',
            full_name: 'Test Runner'
        });
        console.log('Register Success:', res.data);
    } catch (err) {
        console.error('Register Failed:', err.response?.data || err.message);
    }
}

testRegister();
