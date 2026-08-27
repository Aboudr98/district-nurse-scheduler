import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  // No auth check needed here — logging out should always succeed,
  // even if the session is already invalid or expired.

  const cookieStore = await cookies();

  // NEW CONCEPT: cookies().delete(name) removes a cookie by name,
  // the same way cookieStore.set(...) was used at login to create it.
  // This clears the httpOnly 'token' cookie, effectively ending the session,
  // since getSessionUser() will now find no cookie and return null.
  cookieStore.delete('token');

  return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
}
