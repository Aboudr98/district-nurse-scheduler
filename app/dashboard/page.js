"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
    const [user, setUser] = useState(null);

useEffect(() => {


          fetch('/api/me')
            .then(response => response.json())
            .then(data => {
                // store the result in state
                setUser(data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        
        
    },[]);  // empty array = run once, on mount

    return (

  <div>
    <h1>Dashboard</h1>
    {user ? (
      <div>
        <p>Staff ID: {user.staffID}</p>
        <p>Role: {user.role}</p>

        {user.role === 'Admin' && (
  <div>
    <h2>Admin Dashboard</h2>
<p>Welcome back, {user.name}.</p>
<p>Manage patients, visits, and schedules below.</p>
    {/* NEW: navigation links to Admin-facing pages, using next/link for client-side routing */}
    <nav>
      <Link href="/patients/new">Register Patient</Link>
      {" | "}
      <Link href="/visits/new">Assign Visit</Link>
      {" | "}
      <Link href="/schedule/new">Generate Schedule</Link>
    </nav>
  </div>
)}
{user.role === 'Nurse' && (
  <div>
    <h2>Nurse Dashboard</h2>
    <p>Welcome back, {user.name}.</p>
    <p>View and manage your assigned visits below.</p>
    {/* NEW: link to the Nurse's visit list */}
    <nav>
      <Link href="/nurse/visits">My Visits</Link>
    </nav>
  </div>
)}
      </div>
    ) : (
      <p>Loading user data...</p>
    )}
  </div>
);// useEffect hook to fetch user data on component mount
}