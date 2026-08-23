DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS patient;
DROP TABLE IF EXISTS base;
DROP TABLE IF EXISTS nurse;
DROP TABLE IF EXISTS schedule;
DROP TABLE IF EXISTS visit;

CREATE TABLE staff (
    staffID INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL   
); //add a constraint to ensure that the role is either 'Admin' or 'Nurse'

CREATE TABLE patient (
    patientID INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    clinicalPriority VARCHAR(20) NOT NULL,
    visitRequirements VARCHAR(255)
);

CREATE TABLE base (
    baseID INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL
);

CREATE TABLE nurse (
    nurseID INTEGER PRIMARY KEY AUTOINCREMENT,
    staffID INTEGER NOT NULL,
    baseID INTEGER NOT NULL,
    FOREIGN KEY (staffID) REFERENCES staff(staffID),
    FOREIGN KEY (baseID) REFERENCES base(baseID)
);

CREATE TABLE schedule (
    scheduleID INTEGER PRIMARY KEY AUTOINCREMENT,
    nurseID INTEGER NOT NULL,
    createdBy INTEGER NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (nurseID) REFERENCES nurse(nurseID),
    FOREIGN KEY (createdBy) REFERENCES staff(staffID)
);

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

INSERT INTO staff (name, username, passwordHash, role) VALUES
('Alice Johnson', 'alice.johnson', 'hashed_password_1', 'Admin'),
('Bob Smith', 'bob.smith', 'hashed_password_2', 'Nurse'),
('Charlie Brown', 'charlie.brown', 'hashed_password_3', 'Nurse');

INSERT INTO base (name, lat, lng) VALUES
('Manchester Central', 53.4808, -2.2426),
('Salford', 53.4875, -2.2901),
('Stockport', 53.4084, -2.1494);

INSERT INTO nurse (staffID, baseID) VALUES
(2, 1),
(3, 2);

ALTER TABLE patient ADD COLUMN lat REAL;
ALTER TABLE patient ADD COLUMN lng REAL;

INSERT INTO patient (name, location, lat, lng, clinicalPriority) VALUES
('Margaret Wilson', '14 Oak Street, Chorlton, Manchester', 53.4437, -2.2716, 'High'),
('David Chen', '22 Beech Grove, Salford', 53.4875, -2.2901, 'Low'),
('Susan Taylor', '7 Elm Close, Stockport', 53.4084, -2.1494, 'Critical'),
('James O''Brien', '39 Willow Road, Didsbury, Manchester', 53.4085, -2.2296, 'Medium'),
('Patricia Evans', '5 Maple Avenue, Eccles, Salford', 53.4816, -2.3389, 'High'),
('Robert Ahmed', '18 Cedar Lane, Levenshulme, Manchester', 53.4364, -2.1928, 'Low');

Insert INTO schedule (nurseID, createdBy, date) VALUES
(1, 1, '2024-06-01'),
(2, 1, '2024-06-01');

Insert INTO visit (patientID, nurseID, scheduleID, status) VALUES
(1, 1, 1, 'pending'),
(2, 1, 1, 'pending'),
(3, 2, 2, 'pending'),
(4, 2, 2, 'pending'),
(5, 1, 1, 'pending'),
(6, 2, 2, 'pending');

SELECT visitID, sequencePosition, status FROM visit WHERE nurseID = 1;


UPDATE staff SET passwordHash = '$2b$10$GHKwHaWCbwwfLOTBgQnAdOqQfYwJE61AlbCm9W.cTgcnsdB37K0i2' WHERE username = 'bob.smith';

SELECT * FROM patient ORDER BY patientID DESC LIMIT 1;

SELECT * FROM visit WHERE scheduleID = (SELECT scheduleID FROM schedule WHERE nurseID = 2 AND date = '2026-08-20');