const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("cable.db");

db.run(`
CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  phone TEXT,
  village TEXT,
  type TEXT,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

app.post("/request", (req, res) => {
  const { name, phone, village, type, message } = req.body;

  if (!name || !phone || !village || !type) {
    return res.json({ success: false, message: "Please fill all required fields" });
  }

  db.run(
    "INSERT INTO requests (name, phone, village, type, message) VALUES (?, ?, ?, ?, ?)",
    [name, phone, village, type, message],
    () => {
      res.json({ success: true, message: "Request submitted successfully!" });
    }
  );
});

app.get("/admin/requests", (req, res) => {
  db.all("SELECT * FROM requests ORDER BY id DESC", (err, rows) => {
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
