const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5050;

const notesFile = path.join(__dirname, 'notes.json');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Helper functions
function getNotes() {
  try {
    if (!fs.existsSync(notesFile)) return [];
    const data = fs.readFileSync(notesFile, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading notes:', err);
    return [];
  }
}

function saveNotes(notes) {
  try {
    fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2));
  } catch (err) {
    console.error('Error saving notes:', err);
  }
}

// ✅ Route 1: Get all notes
app.get('/notes', (req, res) => {
  const notes = getNotes();
  res.status(200).json(notes);
});

// ✅ Route 2: Add a new note
app.post('/notes', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const notes = getNotes();
  const newNote = { id: Date.now(), title, content };
  notes.push(newNote);
  saveNotes(notes);

  res.status(201).json({ message: 'Note added successfully', note: newNote });
});

// ✅ Route 3: Delete a note by ID
app.delete('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const notes = getNotes();
  const updated = notes.filter(note => note.id !== id);

  if (updated.length === notes.length) {
    return res.status(404).json({ error: 'Note not found' });
  }

  saveNotes(updated);
  res.status(200).json({ message: 'Note deleted successfully' });
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

  res.status(200).json({ message: 'Note updated successfully', note: notes[index] });
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to Note Manager API 🚀');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
