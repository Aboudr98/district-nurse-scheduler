require('dotenv').config({ path: '.env.local' });
const db = require('./lib/db');

async function checkData() {
  const schedules = await db.execute('SELECT * FROM schedule ORDER BY scheduleID DESC LIMIT 5');
  console.log('Recent schedules:');
  console.table(schedules.rows);

  const visits = await db.execute('SELECT * FROM visit ORDER BY visitID DESC LIMIT 5');
  console.log('Recent visits:');
  console.table(visits.rows);
}

checkData();