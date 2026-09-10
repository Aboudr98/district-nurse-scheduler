const db = require('../../../lib/db');
import { NextResponse } from 'next/server';
const { getSessionUser } = require('../../../lib/auth');

export async function GET(request) {
    const sessionUser = await getSessionUser();
    
    if (!sessionUser) {
        return NextResponse.json({ message: 'Not logged in' }, { status: 401 });
    }
    if (sessionUser.role !== 'Admin') {
        return NextResponse.json({ message: 'Not authorised' }, { status: 403 });
    }

    //const nurses = db.prepare('SELECT nurse.nurseID, staff.name FROM nurse INNER JOIN staff ON nurse.staffID = staff.staffID').all();

const queryResult = await db.execute({
    sql: 'SELECT nurse.nurseID, staff.name FROM nurse INNER JOIN staff ON nurse.staffID = staff.staffID',
    args: [],
    });

    const nurses = queryResult.rows;






    return NextResponse.json(nurses, { status: 200 });



}
