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

<div className="px-4 py-12">
  <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
    <h1 className="text-2xl font-semibold mb-6 text-gray-900">Dashboard</h1>
    {user ? (
      <div>


        {user.role === 'Admin' && (
  <div>
<h2 className="text-xl font-semibold mb-2 text-gray-900">Admin Dashboard</h2>
<p className="text-gray-600 mb-1">Welcome back, {user.name}.</p>
<p className="text-gray-600 mb-4">Manage patients, visits, and schedules below.</p>
    {/* NEW: navigation links to Admin-facing pages, using next/link for client-side routing */}
    <nav>
<nav className="flex flex-wrap gap-3">
  <Link href="/patients/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium">Register Patient</Link>
  <Link href="/visits/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium">Assign Visit</Link>
  <Link href="/schedule/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium">Generate Schedule</Link>
  <Link href="/schedule/all" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium">View All Schedules</Link>
</nav>
</nav>
  </div>
)}
{user.role === 'Nurse' && (
  <div>
    <h2 className="text-xl font-semibold mb-2 text-gray-900">Nurse Dashboard</h2>
    <p className="text-gray-600 mb-1">Welcome back, {user.name}.</p>
    <p className="text-gray-600 mb-4">View and manage your assigned visits below.</p>
    {/* NEW: link to the Nurse's visit list */}
    
    <nav className="flex flex-wrap gap-3">
      <Link href="/nurse/visits" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium">My Visits</Link>
    </nav>
  </div>
)}
      </div>
    ) : (
    <p className="text-gray-600">Loading user data...</p>    )}
  </div>
  </div>
);// useEffect hook to fetch user data on component mount
}