require('dotenv').config({ path: '.env.local' });
const db = require('./lib/db');

async function seedBase() {
  await db.execute({
    sql: 'INSERT INTO base (name, lat, lng) VALUES (?, ?, ?)',
    args: ['Manchester Central', 53.4808, -2.2426],
  });
  console.log('Base location created successfully.');
}

seedBase();