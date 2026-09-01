"use client";

import { useState, useEffect } from "react";

export default function NurseVisitsPage() {
  const [visits, setVisits] = useState([]);

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

  useEffect(() => {
    fetchVisits();
  }, []);

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
    <div className="px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">My Visits</h2>

        {visits.length === 0 ? (
          <p className="text-gray-600">No visits scheduled for today.</p>
        ) : (
          <ol className="flex flex-col gap-3">
            {visits.map((visit) => (
              <li
                key={visit.visitID}
                className="flex items-center justify-between border border-gray-200 rounded px-4 py-3"
              >
                <div className="text-gray-700">
                  <span className="font-medium text-gray-900">
                    {visit.sequencePosition}. {visit.name} 
                  </span>
                  <span className="text-gray-500"> — {visit.location}</span>
                  <span className="text-gray-500"> ({visit.clinicalPriority})</span>
                  <span className={visit.status === 'completed' ? 'bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs' : 'bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs'}> {visit.status}</span>
                </div>

                {visit.status === 'pending' && (
                  <button onClick={() => markComplete(visit.visitID)} className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap"> Mark Complete </button>
                )}
          

              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}