const form = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');

// Fetch and display all notes
async function fetchNotes() {
  try {
    const res = await fetch('/notes');
    const notes = await res.json();
    displayNotes(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
  }
}

// Display notes in DOM
function displayNotes(notes) {
  notesList.innerHTML = '';
  notes.forEach(note => {
    const div = document.createElement('div');
    div.classList.add('note');
    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <button class="deleteNote">Delete</button>
    `;

    const deleteBtn = div.querySelector('.deleteNote');
    deleteBtn.addEventListener('click', async () => {
      await deleteNoteById(note.id);
    });

    notesList.appendChild(div);
  });
}

// Delete note by ID
async function deleteNoteById(id) {
  try {
    await fetch(`/notes/${id}`, { method: 'DELETE' });
    fetchNotes(); // Refresh list after deletion
  } catch (err) {
    console.error('Error deleting note:', err);
  }
}

// Add new note
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();

  if (!title || !content) return alert('Both fields are required');

  try {
    await fetch('/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });
    form.reset();
    fetchNotes();
  } catch (err) {
    console.error('Error adding note:', err);
  }
});

// Initial load
fetchNotes();
