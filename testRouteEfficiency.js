// testRouteEfficiency.js
//
// Standalone evaluation script computing the ratio between this project's
// greedy heuristic's route score and the true, brute-force optimal route
// score for the same weighted scoring problem, for small numbers of
// patients where checking every possible ordering is feasible.
// Addresses the ToR's "route efficiency ratio" evaluation requirement.
//
// This compares against the algorithm's own actual objective (the combined
// distance-and-priority weighted score), not total travel distance alone,
// since the algorithm was never designed to minimise distance in isolation.

const fs = require('fs');
const path = require('path');
const { generateSchedule, calculateScore, calculateDistance } = require('./lib/scheduler');

const DATA_FILE = path.join(__dirname, 'testData.json');
const TEST_SIZES = [4, 5, 6, 7, 8];
const nurseStart = { lat: 53.4808, lng: -2.2426 };

const fullDataset = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

// Scores one fixed, predetermined ordering of patients by replaying the same
// step-by-step logic generateSchedule uses internally, but without the
// greedy "pick the best" decision — the order is already fixed.
function scoreRoute(nurseStart, orderedPatients) {
  let current = nurseStart;
  let remaining = [...orderedPatients];
  let totalScore = 0;

  for (const patient of orderedPatients) {
    const allDistances = remaining.map(p => calculateDistance(current, p.location));
    totalScore += calculateScore(current, patient, allDistances);
    current = patient.location;
    remaining = remaining.filter(p => p !== patient);
  }

  return totalScore;
}

// Generates every possible ordering of an array (n! permutations),
// feasible only for small n.
function permutations(arr) {
  if (arr.length <= 1) return [arr];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of permutations(rest)) {
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}

function findOptimalRoute(nurseStart, patients) {
  let bestScore = Infinity;
  for (const perm of permutations(patients)) {
    const score = scoreRoute(nurseStart, perm);
    if (score < bestScore) bestScore = score;
  }
  return bestScore;
}

function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

console.log('Size | Greedy Score | Optimal Score | Efficiency Ratio | Permutations Checked');
console.log('-----|--------------|----------------|-------------------|----------------------');

for (const size of TEST_SIZES) {
  const patients = fullDataset.slice(0, size);

  const greedyRoute = generateSchedule(nurseStart, patients);
  const greedyScore = scoreRoute(nurseStart, greedyRoute);
  const optimalScore = findOptimalRoute(nurseStart, patients);
  const ratio = greedyScore / optimalScore;

  console.log(
    `${String(size).padEnd(4)} | ${greedyScore.toFixed(4).padStart(12)} | ${optimalScore.toFixed(4).padStart(14)} | ${ratio.toFixed(4).padStart(17)} | ${String(factorial(size)).padStart(20)}`
  );
}