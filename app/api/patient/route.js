const db = require('../../../lib/db');
import { NextResponse } from 'next/server';

export async function POST(request) {
    const {name, location, lat, lng, clinicalPriority } = await request.json();

    // Insert the new patient into the database
    const insertPatient = db.prepare('INSERT INTO patient (name, location, lat, lng, clinicalPriority) VALUES (?, ?, ?, ?, ?)');
    const result = insertPatient.run(name, location, lat, lng, clinicalPriority);

    //return a success response 

    return NextResponse.json({ message: 'Patient added successfully', patientID: result.lastInsertRowid }, { status: 201 });
}