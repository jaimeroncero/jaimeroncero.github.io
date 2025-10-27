const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("data.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image TEXT
    )
  `);
});

module.exports = db;
