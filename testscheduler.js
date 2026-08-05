const { priorityToNumber, calculateDistance } = require('./lib/scheduler');

console.log(priorityToNumber('Critical')); // expect 4
console.log(priorityToNumber('High'));     // expect 3
console.log(priorityToNumber('Medium'));   // expect 2
console.log(priorityToNumber('Low'));      // expect 1
console.log(priorityToNumber('invalid'));   // expect 1 (fallback)




const pointA = { lat: 53.46, lng: -2.20 };
const pointB = { lat: 53.48, lng: -2.24 };
console.log(calculateDistance(pointA, pointB)); // expect a small real distance in km, e.g. roughly 2-3

