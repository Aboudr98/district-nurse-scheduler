"use client";

import { useState, useEffect } from 'react';

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
                <p>Welcome, {user.name}. You have administrative privileges.</p>
            </div>
        )}
      </div>
    ) : (
      <p>Loading user data...</p>
    )}
  </div>
);// useEffect hook to fetch user data on component mount
}