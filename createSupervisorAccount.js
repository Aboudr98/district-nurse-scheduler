// createSupervisorAccount.js
require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcrypt');
const db = require('./lib/db');

const TEST_PASSWORD = 'usability2026';
const BASE_ID = 1;

async function createSupervisorAccount() {
  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

  const adminUsername = 'supervisor.admin';
  await db.execute({
    sql: 'INSERT INTO staff (name, username, passwordHash, role) VALUES (?, ?, ?, ?)',
    args: ['Supervisor Admin', adminUsername, hashedPassword, 'Admin'],
  });
  console.log(`${adminUsername} / ${TEST_PASSWORD} (Admin)`);

  const nurseUsername = 'supervisor.nurse';
  const nurseResult = await db.execute({
    sql: 'INSERT INTO staff (name, username, passwordHash, role) VALUES (?, ?, ?, ?)',
    args: ['Supervisor Nurse', nurseUsername, hashedPassword, 'Nurse'],
  });
  await db.execute({
    sql: 'INSERT INTO nurse (staffID, baseID) VALUES (?, ?)',
    args: [Number(nurseResult.lastInsertRowid), BASE_ID],
  });
  console.log(`${nurseUsername} / ${TEST_PASSWORD} (Nurse)`);

  console.log('\nSupervisor account pair created successfully.');
}

createSupervisorAccount().catch((error) => {
  console.error('Error creating supervisor account:', error);
});