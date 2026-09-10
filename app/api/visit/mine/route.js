const db = require('../../../../lib/db');
const { getSessionUser } = require('../../../../lib/auth');
import { NextResponse } from 'next/server';

export async function GET(request) {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
        return NextResponse.json({ message: 'Not logged in' }, { status: 401 });
    }

    if (sessionUser.role !== 'Nurse') {
        return NextResponse.json({ message: 'Not authorised' }, { status: 403 });
    }

    const findNurseResult = await db.execute({
        sql: 'SELECT nurseID FROM nurse WHERE staffID = ?',
        args: [sessionUser.staffID],
    });

    const findNurse = findNurseResult.rows[0];

    const today = new Date().toISOString().split('T')[0];

    const scheduleResult = await db.execute({
        sql: 'SELECT visit.visitID, visit.patientID, visit.sequencePosition, visit.status, patient.name, patient.location, patient.clinicalPriority FROM visit INNER JOIN schedule ON visit.scheduleID = schedule.scheduleID INNER JOIN patient ON visit.patientID = patient.patientID WHERE visit.nurseID = ? AND schedule.date = ?',
        args: [findNurse.nurseID, today],
    });

    const schedule = scheduleResult.rows;

    return NextResponse.json(schedule, { status: 200 });
}


