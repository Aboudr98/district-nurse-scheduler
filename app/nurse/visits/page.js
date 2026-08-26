"use client";

import { useState, useEffect } from "react";

export default function NurseVisitsPage() {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
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

    fetchVisits();
  }, []);

  return (
    <div>
      <h2>My Visits</h2>
      <ol>
      { visits.map( visit => <li key={visit.visitID} > {visit.patientID} {visit.sequencePosition} {visit.name} {visit.location} {visit.clinicalPriority} </li> )}
    </ol>
    </div>
  );
}