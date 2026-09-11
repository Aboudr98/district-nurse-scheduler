require('dotenv').config({ path: '.env.local' });
const db = require('./lib/db');

async function clearTestData() {
  // Delete visits first, since they reference schedules via a foreign key
  await db.execute('DELETE FROM visit');
  console.log('All visit records deleted.');

  await db.execute('DELETE FROM schedule');
  console.log('All schedule records deleted.');

  // Also clear any patients created during testing, so participants
  // start with a genuinely empty patient list
  await db.execute('DELETE FROM patient');
  console.log('All patient records deleted.');

  console.log('\nDatabase cleared. Staff, nurse, and base records were left untouched.');
}

clearTestData().catch((error) => {
  console.error('Error clearing test data:', error);
});