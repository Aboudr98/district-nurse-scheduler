  "use client";

import { useState } from 'react';

export default function NewPatientPage() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [clinicalPriority, setClinicalPriority] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);

    return (
        <div className="px-4 py-12">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold mb-6 text-gray-900">Add New Patient</h1>

                {feedback && (
                    <div className={`mb-4 px-4 py-2 rounded text-sm ${
                        feedback.type === 'error'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                        {feedback.text}
                    </div>
                )}

                <form className="flex flex-col gap-4" onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    setFeedback(null);
                    try {
                        const response = await fetch('/api/patient', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name, location, lat: parseFloat(lat), lng: parseFloat(lng), clinicalPriority }),
                        });

                        const data = await response.json();
                        if (response.ok) {
                            setFeedback({ type: 'success', text: `Patient added successfully with ID: ${data.patientID}` });
                            setName('');
                            setLocation('');
                            setLat('');
                            setLng('');
                            setClinicalPriority('');
                        } else {
                            setFeedback({ type: 'error', text: data.message });
                        }
                    } catch (error) {
                        console.error('Error adding patient:', error);
                        setFeedback({ type: 'error', text: 'An error occurred while adding the patient. Please try again.' });
                    } finally {
                        setIsSubmitting(false);
                    }
                }}>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Latitude</label>
                        <input type="text" placeholder="Must be within 53.35 to 53.55" value={lat} onChange={(e) => setLat(e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Longitude</label>
                        <input type="text" placeholder="Must be within -2.35 to -2.10" value={lng} onChange={(e) => setLng(e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Clinical Priority</label>
                        <select value={clinicalPriority} onChange={(e) => setClinicalPriority(e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Clinical Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50">{isSubmitting ? 'Adding...' : 'Add Patient'}</button>
                </form>
            </div>
        </div>
    );
}
 
