"use client";

import { useState, useEffect } from "react";

export default function AllSchedulesPage() {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    const fetchAllSchedules = async () => {
      try {
        const response = await fetch("/api/schedule/all");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVisits(data);
      } catch (error) {
        console.error("Error fetching all schedules:", error);
      }
    };
    fetchAllSchedules();
  }, []);

  // NEW: .reduce() takes an array and "reduces" it down into a single value —
  // in this case, an object where each key is a nurse's name, and each value
  // is an array of that nurse's visits.
  //
  // reduce() takes two arguments:
  //   1. A function that runs once per item in the array, receiving:
  //      - `groups` (the object being built up so far — called the "accumulator")
  //      - `visit` (the current item from the array)
  //   2. The starting value for `groups` — here, an empty object {}
  //
  // On each pass:
  //   - If we haven't seen this nurse's name as a key in `groups` yet,
  //     create it and set it to an empty array.
  //   - Then push the current visit into that nurse's array.
  //   - Finally, return `groups` so the next iteration has the updated object.
  //
  // After processing every visit, the final result looks like:
  // {
  //   "Bob Smith": [ {visit1}, {visit2} ],
  //   "Charlie Brown": [ {visit3} ]
  // }
  const groupedByNurse = visits.reduce((groups, visit) => {
    if (!groups[visit.nurseName]) {
      groups[visit.nurseName] = [];
    }
    groups[visit.nurseName].push(visit);
    return groups;
  }, {});

  // NEW: Object.entries() converts an object into an array of [key, value] pairs,
  // so we can .map() over it the same way we map over a normal array.
  // Object.entries({ "Bob Smith": [...] }) becomes [["Bob Smith", [...]]]
  // This lets us render one block per nurse.
  return (
    <div className="px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">All Schedules Today</h2>

        {visits.length === 0 ? (
          <p className="text-gray-600">No visits scheduled for today.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {Object.entries(groupedByNurse).map(([nurseName, nurseVisits]) => (
              <div key={nurseName}>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{nurseName}</h3>
                <ol className="flex flex-col gap-2">
                  {nurseVisits.map((visit, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between border border-gray-200 rounded px-4 py-2"
                    >
                      <span className="text-gray-700">{visit.patientName}</span>
                      <span
                        className={
                          visit.status === "completed"
                            ? "bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs"
                            : "bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs"
                        }
                      >
                        {visit.status}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}