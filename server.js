const express = require('express');
const path = require('path');

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

app.get('/db/notes', (req, res) => {
    console.info('Get /db/notes');
    res.status(200).json(notes);
});

app.get('./db/notes/:notes_id', (req, res) => {
    if (req.params.notes_id) {
      console.info(`${req.method} request received to get a single a notes`);
      const notesId = req.params.notes_id;
      for (let i = 0; i < notes.length; i++) {
        const currentNotes = notes[i];
        if (currentNotes.notes_id === notesId) {
          res.json(currentNotes);
          return;
        }
      }
      res.status(404).send('Notes not found');
    } else {
      res.status(400).send('Notes ID not provided');
    }
  });

  app.post('db/notes', (req, res) => {
    
    console.info(`${req.method} request received to add a note`);
  
   
    const { title, text,  } = req.body;
  
    // If all the required properties are present
    if (title && text ) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        notes_id: uuid(),
      };
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting review');
    }
  });

  app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);