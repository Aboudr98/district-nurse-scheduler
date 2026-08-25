"use client";

import { useState } from 'react';

export default function NewPatientPage() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [clinicalPriority, setClinicalPriority] = useState('');
    

    return (
        <div>
            <h1>Add New Patient</h1>
            <form onSubmit={async (e) => {
                try {
                e.preventDefault();
                const response = await fetch('/api/patient', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, location, lat: parseFloat(lat), lng: parseFloat(lng), clinicalPriority }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert(`Patient added successfully with ID: ${data.patientID}`);
                    // Optionally reset the form fields
                    setName('');
                    setLocation('');
                    setLat('');
                    setLng('');
                    setClinicalPriority('');
                } else {
                    alert(`Failed to add patient: ${data.message}`);
                }
            }
            catch (error) {
                console.error('Error adding patient:', error);
                alert('An error occurred while adding the patient. Please try again.'); 
            }}}>
                <label>Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

                <label>Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />

                <label>Latitude</label>
                <input type="text" value={lat} onChange={(e) => setLat(e.target.value)} />

                <label>Longitude</label>
                <input type="text" value={lng} onChange={(e) => setLng(e.target.value)} />

                <select value={clinicalPriority} onChange={(e) => setClinicalPriority(e.target.value)}>
                    <option value="">Select Clinical Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                </select>
                <button type="submit">Add Patient</button>
            </form>
        </div>
    );
}       
