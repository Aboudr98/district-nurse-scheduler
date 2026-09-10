const db = require('../../../lib/db');
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
  const { patientID, nurseID, date } = await request.json();

  if (!nurseID || !date || !patientID) {
  return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
}

  //let schedule = db.prepare('SELECT * FROM schedule WHERE nurseID = ? AND date = ?').get(nurseID, date);

  const scheduleQueryResult = await db.execute({
  sql: 'SELECT * FROM schedule WHERE nurseID = ? AND date = ?',
  args: [nurseID, date],
});

const schedule = scheduleQueryResult.rows[0];

  let scheduleID;

  if (schedule) {
    scheduleID = schedule.scheduleID;
  } else {
    //const newSchedule = db.prepare('INSERT INTO schedule (nurseID, createdBy, date) VALUES (?, ?, ?)');
    // FIX: was `createdBy` (undefined), now uses the logged-in Admin's own staffID
    //const result = newSchedule.run(nurseID, sessionUser.staffID, date);

    const insertScheduleResult = await db.execute({
      sql: 'INSERT INTO schedule (nurseID, createdBy, date) VALUES (?, ?, ?)',
      args: [nurseID, sessionUser.staffID, date],
    });
    
    scheduleID = Number(insertScheduleResult.lastInsertRowid);}

  //const insertVisit = db.prepare('INSERT INTO visit (patientID, nurseID, scheduleID) VALUES (?, ?, ?)');
  //const visitResult = insertVisit.run(patientID, nurseID, scheduleID);

  const visitResult = await db.execute({
    sql: 'INSERT INTO visit (patientID, nurseID, scheduleID) VALUES (?, ?, ?)',
    args: [patientID, nurseID, scheduleID],
  });

  const visitID = Number(visitResult.lastInsertRowid);

  return NextResponse.json({ message: 'Visit added successfully', visitID: visitID }, { status: 201 });
}

export async function PATCH(request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ message: 'Not logged in' }, { status: 401 });
  }
  if (sessionUser.role !== 'Nurse') {
    return NextResponse.json({ message: 'Not authorised' }, { status: 403 });
  }
  const { visitID } = await request.json();

  // RESTORED: this was accidentally replaced with schedule-creation code.
  // This route's real job is marking a visit complete, using visitID only.
  //const updateVisit = db.prepare('UPDATE visit SET status = ?, completedAt = ? WHERE visitID = ?');
  //const result = updateVisit.run('completed', new Date().toISOString(), visitID);

  const updateVisitResult = await db.execute({
    sql: 'UPDATE visit SET status = ?, completedAt = ? WHERE visitID = ?',
    args: ['completed', new Date().toISOString(), visitID],
  });

  if (updateVisitResult.rowsAffected === 0) {
    return NextResponse.json({ message: 'Visit not found or no changes made' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Visit updated successfully as completed', visitID: visitID }, { status: 200 });
}