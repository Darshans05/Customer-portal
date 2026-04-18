const authService = require('./services/authService');
require('dotenv').config();

async function testLogin() {
  try {
    const result = await authService.login('k901996', 'Darshan@1974');
    console.log('Login Result:', result);
  } catch (err) {
    console.error('Login Error:', err.message);
  }
}

testLogin();
