const express = require('express');
const path = require('path');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');
const { readAndAppend } = require('./helpers/fsUtils');
const { readFromFile } = require('./helpers/fsUtils');
const { writeToFile} = require('./helpers/fsUtils');

/****************************************
 load notes for first time
 ****************************************/
readFromFile('./db/db.json').then((data) => { 
  var notes=JSON.parse(data)
})

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

/****************************************
 Route get '/'
 Default load of index.html
 ****************************************/
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

/****************************************
Route get '/notes'
 ****************************************/
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

/****************************************
 route get '/api/notes'
 returns all notes
 ****************************************/
app.get('/api/notes', (req, res) => 
  readFromFile('./db/db.json').then((data) => { 
    notes=JSON.parse(data)
    res.json(notes)
  })
);

/****************************************
 route get '/api/notes/:id
 returns one not with the id
 ****************************************/
app.get('/api/notes/:id', (req, res) => {
  if (req.params.id) {
    const noteId = req.params.id;
    for (let i = 0; i < notes.length; i++) {
      const currentnote = notes[i];
      if (currentnote.id === noteId) {
        res.json(currentnote);
        return;
      }
    }
    res.status(404).send('note not found');
  } else {
    res.status(400).send('note ID not provided');
  }
});

/****************************************
 route post '/api/notes'
 add a new note
 ****************************************/
app.post('/api/notes', (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;
  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newnote = {
      title,
      text,
      id: uuid(),
    };
    readAndAppend(newnote, './db/db.json');
    const response = {
      status: 'success',
      body: newnote,
    };
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});

/****************************************
 route delete '/api/notes/:id
 deletes one note with id
 ****************************************/
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  if(noteId){
    for (let i = 0; i < notes.length; i++) {
      const currentnote = notes[i];
      if (currentnote.id === noteId) {
        const deletedNote=notes.splice(i,1)
        writeToFile('./db/db.json',notes)
        res.json(deletedNote);
        return;
      }
    }
    res.status(404).send('note not found');
  }
  else {
    res.status(400).send('note ID not provided');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
