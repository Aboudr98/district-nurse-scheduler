const db = require('../../../../lib/db');
import { NextResponse } from 'next/server';
const { getSessionUser } = require('../../../../lib/auth');

export async function GET(request) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return NextResponse.json({ message: 'Not logged in' }, { status: 401 });
  }
  if (sessionUser.role !== 'Admin') {
    return NextResponse.json({ message: 'Not authorised' }, { status: 403 });
  }

  const today = new Date().toISOString().split('T')[0];

  const visits = db.prepare(`
    SELECT 
      staff.name AS nurseName, 
      patient.name AS patientName, 
      visit.sequencePosition, 
      visit.status
    FROM visit 
    INNER JOIN schedule ON visit.scheduleID = schedule.scheduleID 
    INNER JOIN nurse ON schedule.nurseID = nurse.nurseID 
    INNER JOIN staff ON nurse.staffID = staff.staffID 
    INNER JOIN patient ON visit.patientID = patient.patientID
    WHERE schedule.date = ?
  `).all(today);

  return NextResponse.json(visits, { status: 200 });
}