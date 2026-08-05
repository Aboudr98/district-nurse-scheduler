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

  // Radius of the Earth (in kilometers)
  const earthRadiusKm = 6371;

  // Haversine formula
  const distance = Math.acos(
    Math.sin(startingLat) * Math.sin(destinationLat) +
    Math.cos(startingLat) * Math.cos(destinationLat) *
    Math.cos(startingLong - destinationLong)
  ) * earthRadiusKm;

  return distance;
}



module.exports = { priorityToNumber, calculateDistance };







