"use client";

import { useState } from "react";
import { useEffect } from "react";

export default function NewSchedulePage() {
  // A useState for nurses (starts as an empty array []) to hold the fetched list
  const [nurses, setNurses] = useState([]);
  const [selectedNurseID, setSelectedNurseID] = useState("");
  const [date, setDate] = useState("");
  const [generatedSchedule, setGeneratedSchedule] = useState(null);
  // A useEffect to call GET /api/nurses on page load and populate that state — same pattern as dashboard's /api/me fetch
  useEffect(() => {
    const fetchNurses = async () => {
      try {
        const response = await fetch("/api/nurses");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNurses(data);
      } catch (error) {
        console.error("Error fetching nurses:", error);
      }
    };
    // A useState for the selected nurseID and one for date
    fetchNurses();
  }, []);

  return (
    <div>
<form onSubmit={async (e) => {
    try{
    e.preventDefault();
                const response = await fetch('/api/schedule', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nurseID: selectedNurseID, date}),
                });
                const data = await response.json();

                if (response.ok) {
                    setGeneratedSchedule(data.schedule);
                } else {
                    alert(`failed to generate schedule`)
                }
    } catch (error) {

                console.error('Error generating schedule:', error);
                alert('An error occurred while generating the schedule. Please try again.'); 
    }
            }}>

        <div>
      <h2>new schedule</h2>
      <select
        value={selectedNurseID}
        onChange={(e) => setSelectedNurseID(e.target.value)}
      >
        <option value="">-- Select Nurse --</option>
        { nurses.map( nurse =>  <option key={nurse.nurseID} value={nurse.nurseID}>{nurse.name}</option> )}
      </select>
      <label>Date</label>
    
    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
    <button type="submit">Generate Schedule</button>

   </div>
    </form>
    

    {generatedSchedule && (
  <div>
    <h3>Generated Schedule</h3>
    <ol>
      { generatedSchedule.map( visit => <li key={visit.patientID}>{visit.patientName} - {visit.clinicalPriority} </li> )}
    </ol>
  </div>
  
)}
</div>
);
}



