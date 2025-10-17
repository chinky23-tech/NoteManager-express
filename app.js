const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const notesFile = path.join(__dirname, 'notes.json');
// After express import
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON body
app.use(express.json());

// Helper functions
function getNotes() {
  const data = fs.readFileSync(notesFile, 'utf-8');
  return JSON.parse(data);
}

function saveNotes(notes) {
  fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2));
}

// ✅ Route 1: Get all notes
app.get('/notes', (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

// ✅ Route 2: Add a new note
app.post('/notes', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content required' });
  }

  const notes = getNotes();
  const newNote = { id: Date.now(), title, content };
  notes.push(newNote);
  saveNotes(notes);

  res.json({ message: 'Note added successfully', note: newNote });
});

// ✅ Route 3: Delete a note by ID
app.delete('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let notes = getNotes();
  const updated = notes.filter(note => note.id !== id);

  if (updated.length === notes.length) {
    return res.status(404).json({ error: 'Note not found' });
  }

  saveNotes(updated);
  res.json({ message: 'Note deleted successfully' });
});

// ✅ Route 4: Update a note by ID
app.put('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;

  let notes = getNotes();
  const index = notes.findIndex(note => note.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  notes[index] = { ...notes[index], title, content };
  saveNotes(notes);

  res.json({ message: 'Note updated successfully', note: notes[index] });
});

// ✅ Default route
app.get('/', (req, res) => {
  res.send('Welcome to Note Manager API 🚀');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
