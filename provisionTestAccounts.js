require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcrypt');
const db = require('./lib/db');

const PARTICIPANT_COUNT = 8;
const TEST_PASSWORD = 'usability2026';
const BASE_ID = 1;

async function provisionAccounts() {
  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

  console.log('Username'.padEnd(15), 'Role'.padEnd(10), 'Password');
  console.log('-'.repeat(45));

  for (let i = 1; i <= PARTICIPANT_COUNT; i++) {
    // Administrator account
    const adminUsername = `p${i}.admin`;
    await db.execute({
      sql: 'INSERT INTO staff (name, username, passwordHash, role) VALUES (?, ?, ?, ?)',
      args: [`Participant ${i} (Admin)`, adminUsername, hashedPassword, 'Admin'],
    });
    console.log(adminUsername.padEnd(15), 'Admin'.padEnd(10), TEST_PASSWORD);

    // Nurse account
    const nurseUsername = `p${i}.nurse`;
    const nurseResult = await db.execute({
      sql: 'INSERT INTO staff (name, username, passwordHash, role) VALUES (?, ?, ?, ?)',
      args: [`Participant ${i} (Nurse)`, nurseUsername, hashedPassword, 'Nurse'],
    });
    await db.execute({
      sql: 'INSERT INTO nurse (staffID, baseID) VALUES (?, ?)',
      args: [Number(nurseResult.lastInsertRowid), BASE_ID],
    });
    console.log(nurseUsername.padEnd(15), 'Nurse'.padEnd(10), TEST_PASSWORD);
  }

  console.log('\nAll 16 test accounts created successfully.');
}

provisionAccounts().catch((error) => {
  console.error('Error provisioning accounts:', error);
});