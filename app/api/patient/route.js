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
    const insertPatient = db.prepare('INSERT INTO patient (name, location, lat, lng, clinicalPriority) VALUES (?, ?, ?, ?, ?)');
    const result = insertPatient.run(name, location, lat, lng, clinicalPriority);

    //return a success response 

    return NextResponse.json({ message: 'Patient added successfully', patientID: result.lastInsertRowid }, { status: 201 });
}
