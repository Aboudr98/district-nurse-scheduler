const db = require('./lib/db');

const staff = db.prepare('SELECT * FROM staff').all();
console.log(staff);

const nurses = db.prepare('SELECT nurse.baseID, base.lat, base.lng FROM nurse INNER JOIN base ON nurse.baseID = base.baseID WHERE nurse.nurseID = ?').get(1);
console.log(nurses);

const pendingVisits = db.prepare('SELECT patient.name,patient.patientID, nurse.nurseID, visit.visitID, visit.status, patient.lat, patient.lng, patient.clinicalPriority FROM patient INNER JOIN visit ON patient.patientID = visit.patientID INNER JOIN nurse ON visit.nurseID = nurse.nurseID WHERE visit.nurseID = ? AND visit.status = \'pending\'').all(1);
console.log(pendingVisits);

const schedulingInput = pendingVisits.map(p => ({ patientID: p.patientID, patientName: p.name, visitID: p.visitID, location: { lat: p.lat, lng: p.lng }, clinicalPriority: p.clinicalPriority }));
console.log(schedulingInput);

// Let's move to the second half of step 1: fetching every patient with a pending 
// visit assigned to this same nurse. This one needs a slightly bigger join, 
// since patient data lives in the patient table, but the connection to 
// "which nurse" and "which visit status" lives in visit.