require('dotenv').config({ path: '.env.local' });
const db = require('./lib/db');

async function testConnection() {
  try {
    const result = await db.execute('SELECT 1 AS test');
    console.log('Connection successful:', result.rows);
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

testConnection();
