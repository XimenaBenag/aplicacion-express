const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

// Base de datos SQLite
const db = new sqlite3.Database('./base.sqlite3', (err) => {
  if (err) {
    console.error(err.message);
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      todo TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// ----------------------
// POST /insert
// ----------------------
app.post('/insert', (req, res) => {
  const { todo } = req.body;

  if (!todo) {
    return res.status(400).json({ error: 'Falta el campo todo' });
  }

  db.run(
    'INSERT INTO todos (todo) VALUES (?)',
    [todo],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        id: this.lastID,
        message: 'Insert successful',
      });
    }
  );
});

// ----------------------
// GET /todos
// ----------------------
app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json(rows);
  });
});

app.get('/todos', (req, res) => {
  res.json({ prueba: 'ok' });
});

// ----------------------
// GET /
// ----------------------
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ----------------------
// SERVER (RENDER)
// ----------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});


