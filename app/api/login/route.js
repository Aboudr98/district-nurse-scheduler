const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../../lib/db');
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';


export async function POST(request) {
    const { username, password } = await request.json();
    
    const result = await db.execute({
        sql: 'SELECT * FROM staff WHERE username = ?',
        args: [username],
    });
    
const staffMember = result.rows[0];

    // if no matching staff member exists, return a 401 failure response
    if (!staffMember) {
        return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    // compare the submitted password against the stored hash using bcrypt.compare
    const isPasswordValid = await bcrypt.compare(password, staffMember.passwordHash);

    // if it doesn't match, return a 401 failure response
    if (!isPasswordValid) {
        return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    // create a signed token containing staffId and role
    const token = jwt.sign({ staffID: staffMember.staffID, name: staffMember.name, role: staffMember.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // set the token as an httpOnly cookie

    const cookieStore = await cookies();
    cookieStore.set('token', token, { httpOnly: true, path: '/' });

    // if it matches, return a success response, including the staff member's role
    return NextResponse.json({ message: 'Login successful', role: staffMember.role }, { status: 200 });
}
