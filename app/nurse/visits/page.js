"use client";

import { useState, useEffect } from "react";

export default function NurseVisitsPage() {
  const [visits, setVisits] = useState([]);

  // MOVED: fetchVisits is now defined at the top level of the component,
  // not nested inside useEffect, so markComplete can call it too.
  const fetchVisits = async () => {
    try {
      const response = await fetch("/api/visit/mine");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVisits(data);
    } catch (error) {
      console.error("Error fetching visits:", error);
    }
  };

  // useEffect now just calls the function defined above, still only once on mount.
  useEffect(() => {
    fetchVisits();
  }, []);

  // NEW: marks a visit complete via PATCH, then refetches the list
  // so the page reflects the updated status.
  const markComplete = async (visitID) => {
    try {
      const response = await fetch("/api/visit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitID }),
      });
      if (response.ok) {
        fetchVisits();
      } else {
        alert("Failed to mark visit complete");
      }
    } catch (error) {
      console.error("Error marking visit complete:", error);
      alert("An error occurred. Please try again.");
    }
  };

return (
    <div>
      <h2>My Visits</h2>
      <ol>
        {visits.map((visit) => (
          <li key={visit.visitID}>
            {visit.patientID} {visit.sequencePosition} {visit.name}{" "}
            {visit.location} {visit.clinicalPriority}
            {/* NEW: button to mark this specific visit complete */}
            <button
  onClick={() => markComplete(visit.visitID)}
  className="ml-2 px-3 py-1 bg-blue-600 text-white rounded"
>
  Mark Complete
</button>
          </li>
        ))}
      </ol>
    </div>
  );
}