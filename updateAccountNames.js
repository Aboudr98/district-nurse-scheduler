require('dotenv').config({ path: '.env.local' });
const db = require('./lib/db');

const PARTICIPANT_COUNT = 8;

async function updateNames() {
  for (let i = 1; i <= PARTICIPANT_COUNT; i++) {
    await db.execute({
      sql: 'UPDATE staff SET name = ? WHERE username = ?',
      args: [`Participant ${i} Admin`, `p${i}.admin`],
    });

    await db.execute({
      sql: 'UPDATE staff SET name = ? WHERE username = ?',
      args: [`Participant ${i} Nurse`, `p${i}.nurse`],
    });

    console.log(`Updated names for Participant ${i}.`);
  }

  console.log('\nAll account names updated successfully.');
}

updateNames().catch((error) => {
  console.error('Error updating account names:', error);
});