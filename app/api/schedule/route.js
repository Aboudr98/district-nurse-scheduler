const db = require('../../../lib/db');
const { generateSchedule } = require('../../../lib/scheduler');
import { NextResponse } from 'next/server';
const { getSessionUser } = require('../../../lib/auth');

export async function POST(request) {

    const sessionUser = await getSessionUser();

    if (!sessionUser) {
        return NextResponse.json({ message: 'Not logged in' }, { status: 401 });
    }
    
    if (sessionUser.role !== 'Admin') {
        return NextResponse.json({ message: 'Not authorised' }, { status: 403 });
    }

        const { nurseID, date } = await request.json();
        
        let schedule = db.prepare('SELECT * FROM schedule WHERE nurseID = ? AND date = ?').get(nurseID, date);
        
        let scheduleID;

        if(schedule) {
        // a schedule already exists, reuse its ID
        scheduleID = schedule.scheduleID;
     } else {
            // create a new schedule
            const newSchedule = db.prepare('INSERT INTO schedule (nurseID, createdBy, date) VALUES (?, ?, ?)');            
            const result = newSchedule.run(nurseID, sessionUser.staffID, date);
            scheduleID = result.lastInsertRowid;
        }

    const nurses = db.prepare('SELECT nurse.baseID, base.lat, base.lng FROM nurse INNER JOIN base ON nurse.baseID = base.baseID WHERE nurse.nurseID = ?').get(nurseID);

    const pendingVisits = db.prepare('SELECT patient.name,patient.patientID, nurse.nurseID, visit.visitID, visit.status, patient.lat, patient.lng, patient.clinicalPriority FROM patient INNER JOIN visit ON patient.patientID = visit.patientID INNER JOIN nurse ON visit.nurseID = nurse.nurseID WHERE visit.scheduleID = ? AND visit.status = \'pending\'').all(scheduleID);
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

    return NextResponse.json({ schedule: finalSchedule, message: 'Schedule generated and updated successfully.' });

}
