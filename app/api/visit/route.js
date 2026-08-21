const db = require('../../../lib/db');
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { patientID, nurseID, date, createdBy } = await request.json();

    // Step 1: check whether a schedule already exists for this nurse and date
    let schedule = db.prepare('SELECT * FROM schedule WHERE nurseID = ? AND date = ?').get(nurseID, date);

    let scheduleID;

    if(schedule) {
        // a schedule already exists, reuse its ID
        scheduleID = schedule.scheduleID;
     } else {
            // create a new schedule
            const newSchedule = db.prepare('INSERT INTO schedule (nurseID, createdBy, date) VALUES (?, ?, ?)');            
            const result = newSchedule.run(nurseID, createdBy, date);
            scheduleID = result.lastInsertRowid;
        }

        // insert the visit itself, using patientID, nurseID, and the scheduleID from above

        const insertVisit = db.prepare('INSERT INTO visit (patientID, nurseID, scheduleID) VALUES (?, ?, ?)');
        const visitResult = insertVisit.run(patientID, nurseID, scheduleID);

        //return a success response, including the new visitID
        return NextResponse.json({ message: 'Visit added successfully', visitID: visitResult.lastInsertRowid }, { status: 201 });
}
