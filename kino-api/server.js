// 1️ Express importieren und App starten
const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json()); 



// 2️ Dummy-Daten 
let filme = [
  { id: 1, titel: "Inception", beschreibung: "Traum im Traum", jahr: 2010, altersfreigabe: 12 },
  { id: 2, titel: "Interstellar", beschreibung: "Weltraumabenteuer", jahr: 2014, altersfreigabe: 12 },
];
let reservierungen = [];

// 3️ Middleware 
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 4️ GET /filme 
app.get("/filme", (req, res) => {
  res.json(filme);
});

// 5️ POST /reservierung 
app.post("/reservierung", (req, res) => {
  const { filmId, tickets, email } = req.body;

  const film = filme.find(f => f.id === filmId);
  if (!film) {
    return res.status(400).json({ fehler: "Film nicht gefunden" });
  }

  const reservierung = {
    id: reservierungen.length + 1,
    filmId,
    tickets,
    email,
    bestaetigung: "Reservierung erfolgreich!"
  };

  reservierungen.push(reservierung);
  res.status(201).json(reservierung);
});

// 6️ GET /reservierung/:id 
app.get("/reservierung/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const reservierung = reservierungen.find(r => r.id === id);

  if (!reservierung) {
    return res.status(404).json({ fehler: "Reservierung nicht gefunden" });
  }

  res.json(reservierung);
});

// 7️Fehlerbehandlung (404)
app.use((req, res, next) => {
  res.status(404).json({ fehler: "Endpunkt nicht gefunden" });
});

// 8️ Fehlerbehandlung (500) + Logging in Datei
app.use((err, req, res, next) => {
  const fehlerText = `${new Date().toISOString()} - ${err.message}\n`;
  fs.appendFileSync("errors.log", fehlerText);
  res.status(500).json({ fehler: "Interner Serverfehler" });
});

// 9️ Server starten
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
