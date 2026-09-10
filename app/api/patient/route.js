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

    const {name, location, lat, lng, clinicalPriority } = await request.json();

    // Insert the new patient into the database
    //const insertPatient = db.prepare('INSERT INTO patient (name, location, lat, lng, clinicalPriority) VALUES (?, ?, ?, ?, ?)');
    // const result = insertPatient.run(name, location, lat, lng, clinicalPriority);


if (lat < 53.35 || lat > 53.55 || lng < -2.35 || lng > -2.10) {
  return NextResponse.json(
    { message: 'Coordinates must be within the Greater Manchester area (latitude 53.35–53.55, longitude -2.35 to -2.10).' },
    { status: 400 }
  );
}

    const insertResult = await db.execute({ 
        sql: 'INSERT INTO patient (name, location, lat, lng, clinicalPriority) VALUES (?, ?, ?, ?, ?)',
        args: [name, location, lat, lng, clinicalPriority]
    });

    const patientID = Number(insertResult.lastInsertRowid);

    //return a success response 

    return NextResponse.json({ message: 'Patient added successfully', patientID: patientID }, { status: 201 });
}

export async function GET() {

    const sessionUser = await getSessionUser();
    
    if (!sessionUser) {
        return NextResponse.json({ message: 'Not logged in' }, { status: 401 });
    }
    if (sessionUser.role !== 'Admin') {
        return NextResponse.json({ message: 'Not authorised' }, { status: 403 });
    }

   // const patients = db.prepare('SELECT patient.patientID, patient.name FROM patient').all();

const queryResult = await db.execute({
    sql: 'SELECT patient.patientID, patient.name FROM patient',
    args: [],
    });

    const patients = queryResult.rows;


    return NextResponse.json(patients, { status: 200 });
}