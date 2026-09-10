require('dotenv').config({ path: '.env.local' });
const db = require('./lib/db');

async function createSchema() {
  // Tables are created in dependency order: a table with a foreign key
  // must be created after the table it references already exists.
  await db.execute(`
    CREATE TABLE staff (
      staffID INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL,
      username VARCHAR(50) NOT NULL UNIQUE,
      passwordHash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE patient (
      patientID INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL,
      location VARCHAR(255) NOT NULL,
      lat REAL,
      lng REAL,
      clinicalPriority VARCHAR(20) NOT NULL,
      visitRequirements VARCHAR(255)
    );
  `);

  await db.execute(`
    CREATE TABLE base (
      baseID INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE nurse (
      nurseID INTEGER PRIMARY KEY AUTOINCREMENT,
      staffID INTEGER NOT NULL,
      baseID INTEGER NOT NULL,
      FOREIGN KEY (staffID) REFERENCES staff(staffID),
      FOREIGN KEY (baseID) REFERENCES base(baseID)
    );
  `);

  await db.execute(`
    CREATE TABLE schedule (
      scheduleID INTEGER PRIMARY KEY AUTOINCREMENT,
      nurseID INTEGER NOT NULL,
      createdBy INTEGER NOT NULL,
      date DATE NOT NULL,
      FOREIGN KEY (nurseID) REFERENCES nurse(nurseID),
      FOREIGN KEY (createdBy) REFERENCES staff(staffID)
    );
  `);

  await db.execute(`
    CREATE TABLE visit (
      visitID INTEGER PRIMARY KEY AUTOINCREMENT,
      patientID INTEGER NOT NULL,
      nurseID INTEGER NOT NULL,
      scheduleID INTEGER NOT NULL,
      timeWindow VARCHAR(50),
      sequencePosition INTEGER,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      completedAt DATETIME,
      FOREIGN KEY (patientID) REFERENCES patient(patientID),
      FOREIGN KEY (nurseID) REFERENCES nurse(nurseID),
      FOREIGN KEY (scheduleID) REFERENCES schedule(scheduleID)
    );
  `);

  console.log('All six tables created successfully.');
}

createSchema().catch((error) => {
  console.error('Error creating schema:', error);
});