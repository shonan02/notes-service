require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Note = require('./models/note');
const app = express();

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if(error.name === 'CastError') {
        return response.status(400).send({error: 'malformed id'});
    } else if(error.name === 'Validation error') {
        return response.status(400).json({ error: error.message});
    }
    next(error);
}
//Use static middleware to show static content
app.use(express.static('dist'));
app.use(express.json());
app.use(cors());
app.use(errorHandler);

app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes);
    })
})

app.get('/api/notes/:id', (req, res, next) => {
    Note.findById(req.params.id)
    .then(note => {
        if(note) {
            res.json(note);
        } else {
            res.status(404).end();
        }
    })
    .catch(err => next(err));
})

app.post('/api/notes', (req, res, next) => {
    const note = Note({
        content: req.body.content,
        important: req.body.important || false,
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
    const { content, important } = request.body;
  
    Note.findByIdAndUpdate(
        request.params.id, 
        {content, important}, 
        { new: true, runValidators: true, context: 'query' }
    )
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server lsitneing on port ${PORT}`);
})
