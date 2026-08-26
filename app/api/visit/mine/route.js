const db = require('../../../../lib/db');
const {getSessionUser} = require('../../../../lib/auth');
import { NextResponse } from 'next/server';

export async function GET(request) {
    const sessionUser = await getSessionUser();
    
        if (!sessionUser) {
            return NextResponse.json({ message: 'Not logged in' }, { status: 401 });
        }

        if (sessionUser.role !== 'Nurse') {
            return NextResponse.json({ message: 'Not authorised' }, { status: 403 });
        }

        const findNurse = db.prepare('SELECT nurseID FROM nurse WHERE staffID = ?').get(sessionUser.staffID)

        const today = new Date().toISOString().split('T')[0];

        const schedule = db.prepare('SELECT visit.visitID, visit.patientID, visit.sequencePosition, patient.name, patient.location, patient.clinicalPriority FROM visit INNER JOIN schedule ON visit.scheduleID = schedule.scheduleID INNER JOIN patient ON visit.patientID = patient.patientID WHERE  visit.nurseID = ? AND schedule.date = ?').all(findNurse.nurseID, today)
        
        return NextResponse.json(schedule, { status: 200 });
    
    }


