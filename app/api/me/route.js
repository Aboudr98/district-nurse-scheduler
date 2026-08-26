const {getSessionUser} = require('../../../lib/auth');
import { NextResponse } from 'next/server';

export async function GET(request) {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
        return NextResponse.json({ message: 'Not logged in' }, { status: 401 });
    }

    return NextResponse.json({ staffID: sessionUser.staffID, name: sessionUser.name, role: sessionUser.role }, { status: 200 });
}
