"use client";

import { useState, useEffect } from "react";

export default function NewSchedulePage() {
  const [nurses, setNurses] = useState([]);
  const [selectedNurseID, setSelectedNurseID] = useState("");
  const [date, setDate] = useState("");
  const [generatedSchedule, setGeneratedSchedule] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    fetchNurses();
  }, []);

  return (
    <div className="px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            try {
              const response = await fetch("/api/schedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nurseID: selectedNurseID, date }),
              });
              const data = await response.json();

              if (response.ok) {
                setGeneratedSchedule(data.schedule);
              } else {
                alert("Failed to generate schedule");
              }
            } catch (error) {
              console.error("Error generating schedule:", error);
              alert("An error occurred while generating the schedule. Please try again.");
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <h2 className="text-2xl font-semibold mb-2 text-gray-900">New Schedule</h2>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Nurse</label>
            <select
              value={selectedNurseID}
              onChange={(e) => setSelectedNurseID(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Nurse --</option>
              {nurses.map((nurse) => (
                <option key={nurse.nurseID} value={nurse.nurseID}>{nurse.name}</option>
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
            {isSubmitting ? "Generating..." : "Generate Schedule"}
          </button>
        </form>

        {generatedSchedule && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Generated Schedule</h3>
            <ol className="list-decimal list-inside flex flex-col gap-1 text-gray-700">
              {generatedSchedule.map((visit) => (
                <li key={visit.visitID}>{visit.patientName} - {visit.clinicalPriority}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}