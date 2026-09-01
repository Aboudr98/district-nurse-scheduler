"use client";

import { useState, useEffect } from "react";

export default function NewVisitPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientID, setSelectedPatientID] = useState("");

  const [nurses, setNurses] = useState([]);
  const [selectedNurseID, setSelectedNurseID] = useState("");

  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();

            if (!date) {
              alert("Please select a date.");
              return;
            }

            setIsSubmitting(true);
            try {
              const response = await fetch("/api/visit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  patientID: selectedPatientID,
                  nurseID: selectedNurseID,
                  date,
                }),
              });
              const data = await response.json();

              if (response.ok) {
                alert(`Visit assigned successfully with ID: ${data.visitID}`);
                setSelectedPatientID("");
                setSelectedNurseID("");
                setDate("");
              } else {
                alert(`Failed to assign visit: ${data.message}`);
              }
            } catch (error) {
              console.error("Error assigning visit:", error);
              alert("An error occurred while assigning the visit. Please try again.");
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <h2 className="text-2xl font-semibold mb-2 text-gray-900">New Visit Assignment</h2>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Patient</label>
            <select
              value={selectedPatientID}
              onChange={(e) => setSelectedPatientID(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Patient --</option>
              {patients.map((patient) => (
                <option key={patient.patientID} value={patient.patientID}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Nurse</label>
            <select
              value={selectedNurseID}
              onChange={(e) => setSelectedNurseID(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Nurse --</option>
              {nurses.map((nurse) => (
                <option key={nurse.nurseID} value={nurse.nurseID}>
                  {nurse.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Assigning..." : "Assign Visit"}
          </button>
        </form>
      </div>
    </div>
  );
}
