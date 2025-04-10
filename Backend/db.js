const Database = require("better-sqlite3");
const db = new Database("queue.db");

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    partySize INTEGER,
    skill REAL,
    matchPref TEXT,
    checkInTime TEXT,
    status TEXT
  )
`
).run();

module.exports = db;
