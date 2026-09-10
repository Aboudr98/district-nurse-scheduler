require('dotenv').config({ path: '.env.local' });
const db = require('./lib/db');

async function checkSchema() {
  const result = await db.execute(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
  );
  console.log('Tables found:', result.rows.map(r => r.name));
}

checkSchema();