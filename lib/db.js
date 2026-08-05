const Database = require('better-sqlite3');
const db = new Database('database.db');
db.pragma('foreign_keys = ON'); // remember, this must be turned on explicitly

module.exports = db;



