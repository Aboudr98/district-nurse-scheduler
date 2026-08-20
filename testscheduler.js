const { generateSchedule } = require('./lib/scheduler');

const nurseStart = { lat: 53.46, lng: -2.20 };

const testPatients = [
  { name: "Alice", location: { lat: 53.48, lng: -2.24 }, clinicalPriority: "Low" },
  { name: "Bob", location: { lat: 53.47, lng: -2.23 }, clinicalPriority: "Critical" },
  { name: "Carla", location: { lat: 53.50, lng: -2.28 }, clinicalPriority: "Medium" },
];

const schedule = generateSchedule(nurseStart, testPatients);

schedule.forEach((p, i) => console.log(`${i + 1}. ${p.name} (${p.clinicalPriority})`));

