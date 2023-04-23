const express = require('express');
const path = require('path');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');
const notes = require('./db/notes');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET request for notes
app.get('/api/notes', (req, res) => {
  console.info(`GET /api/notes`);
  res.status(200).json(notes);
});

// GET a single note
app.get('/api/notes/:note_id', (req, res) => {
  if (req.params.note_id) {
    console.info(`${req.method} request received to get a single a note`);
    const noteId = req.params.note_id;
    for (let i = 0; i < notes.length; i++) {
      const currentnote = notes[i];
      if (currentnote.note_id === noteId) {
        res.json(currentnote);
        return;
      }
    }
    res.status(404).send('note not found');
  } else {
    res.status(400).send('note ID not provided');
  }
});

// POST request to add a note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newnote = {
      title,
      text,
      note_id: uuid(),
    };

    const response = {
      status: 'success',
      body: newnote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});

// GET request for a specific note's noteupvotes
app.get('/api/notnoteupvotese/:note_id', (req, res) => {
  console.info(`${req.method} request received to get noteupvotes for a note`);
  for (let i = 0; i < notes.length; i++) {
    const currentnote = notes[i];
    if (currentnote.note_id === req.params.note_id) {
      res.status(200).json({
        message: `The note with ID ${currentnote.note_id} has ${currentnote.noteupvotes}`,
        noteupvotes: currentnote.noteupvotes,
      });
      return;
    }
  }
  res.status(404).json('note ID not found');
});

// POST request to upvote a note
app.post('/api/noteupvotes/:note_id', (req, res) => {
  if (req.body && req.params.note_id) {
    console.info(`${req.method} request received to upvote a note`);
    const noteId = req.params.note_id;
    for (let i = 0; i < notes.length; i++) {
      const currentnote = notes[i];
      if (currentnote.note_id === noteId) {
        currentnote.noteupvotes += 1;
        res.status(200).json(`New upvote count is: ${currentnote.noteupvotes}!`);
        return;
      }
    }
    res.status(404).json('note ID not found');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
