"use client";

import { useState, useEffect } from "react";

export default function NewVisitPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientID, setSelectedPatientID] = useState("");

  // NEW: nurse dropdown needs its own state, same pattern as patients
  const [nurses, setNurses] = useState([]);
  const [selectedNurseID, setSelectedNurseID] = useState("");

  const [date, setDate] = useState("");

  // Fetch both patients and nurses on page load.
  // Two separate fetches, each with its own try/catch, run one after another here.
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("/api/patient");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

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

    fetchPatients();
    fetchNurses();
  }, []);

  return (
    <div>
      <form
        onSubmit={async (e) => {
          try {
            e.preventDefault();
            const response = await fetch("/api/visit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              // NEW: nurseID now included, matching what /api/visit POST expects.
              // createdBy is NOT sent from the client — see note below.
              body: JSON.stringify({
                patientID: selectedPatientID,
                nurseID: selectedNurseID,
                date,
              }),
            });
            const data = await response.json();

            if (response.ok) {
              // Simple success feedback, same pattern as your patient registration form.
              alert(`Visit assigned successfully with ID: ${data.visitID}`);
              // Reset form after success
              setSelectedPatientID("");
              setSelectedNurseID("");
              setDate("");
            } else {
              alert(`Failed to assign visit: ${data.message}`);
            }
          } catch (error) {
            console.error("Error assigning visit:", error);
            alert("An error occurred while assigning the visit. Please try again.");
          }
        }}
      >
        <div>
          <h2>New Visit Assignment</h2>

          <label>Patient</label>
          <select
            value={selectedPatientID}
            onChange={(e) => setSelectedPatientID(e.target.value)}
          >
            <option value="">-- Select Patient --</option>
            {patients.map((patient) => (
              <option key={patient.patientID} value={patient.patientID}>
                {patient.name}
              </option>
            ))}
          </select>

          {/* NEW: nurse dropdown, same shape as schedule/new's nurse dropdown */}
          <label>Nurse</label>
          <select
            value={selectedNurseID}
            onChange={(e) => setSelectedNurseID(e.target.value)}
          >
            <option value="">-- Select Nurse --</option>
            {nurses.map((nurse) => (
              <option key={nurse.nurseID} value={nurse.nurseID}>
                {nurse.name}
              </option>
            ))}
          </select>

          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button type="submit">Assign Visit</button>
        </div>
      </form>
    </div>
  );
}
