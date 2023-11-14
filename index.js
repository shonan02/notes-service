require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Note = require('./models/note');
const app = express();


//Use static middleware to show static content
app.use(express.static('dist'));
app.use(express.json());
app.use(cors());


app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes);
    })
})

app.get('/api/notes/:id', (req, res) => {
    Note.findById(req.params.id).then(note => {
        if(note) {
            res.json(note);
        } else {
            res.status(404).end();
        }
    })
    .catch(err => next(err));
})

app.post('api/notes', (req, res, next) => {
    const body = req.body;

    const note = Note({
        content: body.content,
        important: body.important || false,
    })

    note.save().then(saved => {
        res.json(saved);
    })
    .catch(err => next(err));
})

app.delete('/api/notes/:id', (req, res, next) => {
    Note.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end();
        })
        .catch(error => next(error));
})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body
  
    const note = {
      content: body.content,
      important: body.important,
    }
  
    Note.findByIdAndUpdate(request.params.id, note, { new: true })
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })

  
const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;
    return maxId +1;
}


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server lsitneing on port ${PORT}`);
})
