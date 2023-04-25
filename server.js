const express = require('express');
const path = require('path');
const fs = require('fs');

 //const uuid = require('./helpers/uuid');
const notes = require('./db/notes');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => res.send('Navigate to /index or /notes'));

app.get('/index', (req, res) => 
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => 
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/notes.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      res.status(200).json(parsedNotes);
    }
  });
});


  app.post('/api/notes', (req, res) => {
    
    console.info(`${req.method} request received to add a note`);
  
   
    const { title, text } = req.body;
  
    
    if (title && text ) {
     
      
      
      fs.readFile('./db/notes.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const parsedNotes = JSON.parse(data);
          const newNote = {
            id: parsedNotes.length + 1,
            title,
            text,
          };

          parsedNotes.push(newNote);

        
          fs.writeFile(
            './db/notes.json',
            JSON.stringify(parsedNotes, null, 2),
            (writeErr) =>
            writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated notes!')
          
        );
      }
      });
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting notes');
    }
  });

  app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);