const db = require('./lib/db');

const staff = db.prepare('SELECT * FROM staff').all();
console.log(staff);


