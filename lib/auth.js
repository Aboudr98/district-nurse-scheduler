const jwt = require('jsonwebtoken');
import { cookies } from 'next/headers';

export async function getSessionUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
        return null; // No token found, user is not authenticated
    }

    try {
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
        return decoded; // Return the decoded token containing staffID and role
    }
    catch (error) {
        console.error('Error verifying token:', error);
        return null; // Token exists but is invalid or expired
    }
}