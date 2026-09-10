// testPerformance.js
//
// Standalone performance evaluation script, following the same pattern as
// testdb.js and testscheduler.js. Measures how generateSchedule's execution
// time scales as the number of patients increases, addressing the ToR's
// evaluation requirement for "algorithm execution time (ms) across varying
// numbers of clients."
//
// Reproducibility: a synthetic dataset of 100 patients is generated once and
// saved to testData.json. Every subsequent run reads from this same file,
// so results are comparable across repeated runs rather than being measured
// against a freshly randomised dataset each time.
//
// A single "warm-up" call is made before timing begins at each size, and
// discarded. This avoids JIT (Just-In-Time) compilation effects skewing the
// first measurement: JavaScript engines like V8 initially interpret a
// function naively, then optimise it after a few calls, so a function's
// very first execution is typically much slower than its steady-state speed.
// Reported timings reflect the algorithm's real, steady-state performance.

const fs = require('fs');
const path = require('path');
const { generateSchedule } = require('./lib/scheduler');

const DATA_FILE = path.join(__dirname, 'testData.json');
const TEST_SIZES = [5, 10, 20, 50, 100];
const REPETITIONS = 10; // increased from 3, for more stable averages

const LAT_RANGE = [53.35, 53.55];
const LNG_RANGE = [-2.35, -2.10];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

function randomInRange([min, max]) {
  return min + Math.random() * (max - min);
}

function generateSyntheticPatients(count) {
  const patients = [];
  for (let i = 0; i < count; i++) {
    patients.push({
      patientID: i + 1,
      patientName: `Test Patient ${i + 1}`,
      visitID: i + 1,
      location: {
        lat: randomInRange(LAT_RANGE),
        lng: randomInRange(LNG_RANGE),
      },
      clinicalPriority: PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)],
    });
  }
  return patients;
}

function loadOrCreateDataset() {
  if (fs.existsSync(DATA_FILE)) {
    console.log(`Loading existing dataset from ${DATA_FILE} for reproducibility.`);
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }
  console.log('No existing dataset found — generating and saving a new one.');
  const dataset = generateSyntheticPatients(Math.max(...TEST_SIZES));
  fs.writeFileSync(DATA_FILE, JSON.stringify(dataset, null, 2));
  return dataset;
}

const fullDataset = loadOrCreateDataset();
const nurseStart = { lat: 53.4808, lng: -2.2426 };

console.log(`\nEach size warmed up with 1 discarded call, then timed over ${REPETITIONS} repetitions.\n`);
console.log('Size | Min (ms) | Max (ms) | Average (ms)');
console.log('-----|----------|----------|-------------');

for (const size of TEST_SIZES) {
  const patients = fullDataset.slice(0, size);

  // Warm-up call, discarded, so JIT compilation happens before timing starts.
  generateSchedule(nurseStart, patients);

  const timings = [];
  for (let run = 0; run < REPETITIONS; run++) {
    const start = performance.now();
    generateSchedule(nurseStart, patients);
    const end = performance.now();
    timings.push(end - start);
  }

  const average = timings.reduce((sum, t) => sum + t, 0) / timings.length;
  const min = Math.min(...timings);
  const max = Math.max(...timings);

  console.log(
    `${String(size).padEnd(4)} | ${min.toFixed(3).padStart(8)} | ${max.toFixed(3).padStart(8)} | ${average.toFixed(3).padStart(11)}`
  );
}