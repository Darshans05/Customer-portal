const authService = require('./services/authService');
require('dotenv').config();

async function testLogin() {
  try {
    const result = await authService.login('0000000001', 'Darshan@1974');
    console.log('Login 0000000001 Result:', result);
  } catch (err) {
    console.error('Login 0000000001 Error:', err.message);
  }

  try {
    const result = await authService.login('0000000002', 'Darshan@1974');
    console.log('Login 0000000002 Result:', result);
  } catch (err) {
    console.error('Login 0000000002 Error:', err.message);
  }
}

testLogin();
