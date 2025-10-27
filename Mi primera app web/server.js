const express = require("express");
const multer = require("multer");
const db = require("./db");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(express.static("public"));

// Obtener todos los productos
app.get("/api/items", (req, res) => {
  db.all("SELECT * FROM items ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Crear nuevo producto
app.post("/api/items", upload.single("image"), (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? req.file.filename : null;

  db.run(
    "INSERT INTO items (title, description, image) VALUES (?, ?, ?)",
    [title, description, image],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Ver imagen subida
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
