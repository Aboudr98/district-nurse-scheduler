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

    const scheduleQueryResult = await db.execute({
        sql: 'SELECT * FROM schedule WHERE nurseID = ? AND date = ?',
        args: [nurseID, date],
    });
    const schedule = scheduleQueryResult.rows[0];

    let scheduleID;

    if (schedule) {
        scheduleID = schedule.scheduleID;
    } else {
        const insertScheduleResult = await db.execute({
            sql: 'INSERT INTO schedule (nurseID, createdBy, date) VALUES (?, ?, ?)',
            args: [nurseID, sessionUser.staffID, date],
        });
        scheduleID = Number(insertScheduleResult.lastInsertRowid);
    }

    const nurseBaseResult = await db.execute({
        sql: 'SELECT nurse.baseID, base.lat, base.lng FROM nurse INNER JOIN base ON nurse.baseID = base.baseID WHERE nurse.nurseID = ?',
        args: [nurseID],
    });
    const nurses = nurseBaseResult.rows[0];

    const pendingVisitsResult = await db.execute({
        sql: "SELECT patient.name, patient.patientID, nurse.nurseID, visit.visitID, visit.status, patient.lat, patient.lng, patient.clinicalPriority FROM patient INNER JOIN visit ON patient.patientID = visit.patientID INNER JOIN nurse ON visit.nurseID = nurse.nurseID WHERE visit.scheduleID = ? AND visit.status = 'pending'",
        args: [scheduleID],
    });
    const pendingVisits = pendingVisitsResult.rows;

    const schedulingInput = pendingVisits.map(p => ({
        patientID: p.patientID,
        patientName: p.name,
        visitID: p.visitID,
        location: { lat: p.lat, lng: p.lng },
        clinicalPriority: p.clinicalPriority
    }));

    const finalSchedule = generateSchedule(nurses, schedulingInput);

    for (let i = 0; i < finalSchedule.length; i++) {
        await db.execute({
            sql: 'UPDATE visit SET sequencePosition = ? WHERE visitID = ?',
            args: [i + 1, finalSchedule[i].visitID],
        });
    }

    return NextResponse.json({ schedule: finalSchedule, message: 'Schedule generated and updated successfully.' }, { status: 200 });
}