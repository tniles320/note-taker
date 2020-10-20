// Dependencies
// =============================================================
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const express = require('express');
const fs = require('fs');
const path = require('path');

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// saving json data into variable
const noteDb = fs.readFileSync(path.join(__dirname, "db/db.json"));
const parseNote = JSON.parse(noteDb);

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// Root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// returns notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
  });

// get all notes and add unique id's
app.get('/api/notes', (req, res) => {
    for(let i = 0; i < parseNote.length; i ++) {
        parseNote[i].id = i;
    }
    return (res.json(parseNote));
});

// Add a note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  parseNote.push(newNote);
  res.json(parseNote);
  addNote(parseNote);
});

// displays notes using specific id
app.get("/api/notes/:id", function(req,res) {
    res.json(notes[req.params.id]);
});

// deletes a note with specific id
app.delete("/api/notes/:id", function(req, res) {
    parseNote.splice(req.params.id, 1);
    addNote(parseNote);
});

// writes new note to the json file
const addNote = note => {
    return fs.writeFileSync("db/db.json", JSON.stringify(note))
}

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log('App listening on PORT ' + PORT);
});