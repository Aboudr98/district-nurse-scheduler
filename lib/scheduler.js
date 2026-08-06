function priorityToNumber(priority) {
  const weights = { Critical: 4, High: 3, Medium: 2, Low: 1 };
  return weights[priority] || 1;
}

//Source: (to be inputted)
function degToRad(deg) {
  return (deg * Math.PI)/180;
  
}

// Calculate distance between two coordinates
function calculateDistance(startCoords, destCoords) {
  const startingLat = degToRad(startCoords.lat);
  const startingLong = degToRad(startCoords.lng);
  const destinationLat = degToRad(destCoords.lat);
  const destinationLong = degToRad(destCoords.lng);

  // Radius of the Earth (in miles)
const earthRadiusMiles = 3958.8;

const deltaLat = destinationLat - startingLat;
const deltaLong = destinationLong - startingLong;

  // Haversine formula

  const h = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(startingLat) * Math.cos(destinationLat) *
            Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);

  const distance = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)) * earthRadiusMiles;

  return distance;
}

function calculateScore(current, patient) {
  const distance = calculateDistance(current, patient.location);
  const priorityWeight = priorityToNumber(patient.clinicalPriority);

  return distance - priorityWeight;
}

function calculateScore(current, patient, allDistances) {
  const distance = calculateDistance(current, patient.location);
  const priorityWeight = priorityToNumber(patient.clinicalPriority);

  const maxDistance = Math.max(...allDistances);
  const normalisedDistance = maxDistance === 0 ? 0 : distance / maxDistance;

  const normalisedPriority = (priorityWeight - 1) / (4 - 1);

  const distanceWeight = 0.4;
  const priorityWeightPct = 0.6;

  return (distanceWeight * normalisedDistance) + (priorityWeightPct * (1 - normalisedPriority));
}

function pickBestCandidate(current, remaining) {
  const allDistances = remaining.map(p => calculateDistance(current, p.location));

  let best = remaining[0];
  let bestScore = calculateScore(current, best, allDistances);

  for (const patient of remaining) {
    const score = calculateScore(current, patient, allDistances);
    if (score < bestScore) {
      best = patient;
      bestScore = score;
    }
  }

  return best;
}

function generateSchedule(nurseStart, patients) {
  let route = [];
  let current = nurseStart;
  let remaining = [...patients];

  while (remaining.length > 0) {
    const next = pickBestCandidate(current, remaining);
    route.push(next);
    current = next.location;
    remaining = remaining.filter(p => p !== next);
  }

  return route;
}


module.exports = { priorityToNumber, calculateDistance, calculateScore, generateSchedule };






