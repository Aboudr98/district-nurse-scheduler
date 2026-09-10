const db = require('./lib/db');
const { generateSchedule } = require('./lib/scheduler');

const staff = db.prepare('SELECT * FROM staff').all();
console.log(staff);

const nurses = db.prepare('SELECT nurse.baseID, base.lat, base.lng FROM nurse INNER JOIN base ON nurse.baseID = base.baseID WHERE nurse.nurseID = ?').get(1);
console.log(nurses);

const pendingVisits = db.prepare('SELECT patient.name,patient.patientID, nurse.nurseID, visit.visitID, visit.status, patient.lat, patient.lng, patient.clinicalPriority FROM patient INNER JOIN visit ON patient.patientID = visit.patientID INNER JOIN nurse ON visit.nurseID = nurse.nurseID WHERE visit.nurseID = ? AND visit.status = \'pending\'').all(1);
console.log(pendingVisits);

const schedulingInput = pendingVisits.map(p => ({ patientID: p.patientID, patientName: p.name, visitID: p.visitID, location: { lat: p.lat, lng: p.lng }, clinicalPriority: p.clinicalPriority }));
console.log(schedulingInput);

const finalSchedule = generateSchedule(nurses, schedulingInput);
finalSchedule.forEach((p, i) => console.log(`${i + 1}. ${p.patientName} (${p.clinicalPriority})`));

const newSequencePositions = db.prepare('UPDATE visit SET sequencePosition = ? WHERE visitID = ?');
finalSchedule.forEach((p, i) => {
  newSequencePositions.run(i + 1, p.visitID);
});
console.log('Updated sequence positions in the database.');
