require('dotenv').config({ path: '.env.local' });
const db = require('./lib/db');

async function checkAccounts() {
  const result = await db.execute(
    "SELECT staffID, name, username, role FROM staff WHERE username LIKE 'p%' ORDER BY staffID;"
  );
  console.table(result.rows);
}

checkAccounts();