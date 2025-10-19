const form = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');

// Fetch and display all notes
async function fetchNotes() {
  const res = await fetch('/notes');
  const notes = await res.json();
  displayNotes(notes);
}

// Display notes
function displayNotes(notes) {
  notesList.innerHTML = '';
  notes.forEach(note => {
    const div = document.createElement('div');
    div.classList.add('note');
    div.innerHTML = `
      <input type="text" class="edit-title" value="${note.title}" disabled />
      <textarea class="edit-content" disabled>${note.content}</textarea>
      <div class="btn-group">
        <button class="enableEdit">Edit</button>
        <button class="saveEdit" style="display:none;">Save</button>
        <button class="deleteNote">Delete</button>
      </div>
    `;

    const titleField = div.querySelector('.edit-title');
    const contentField = div.querySelector('.edit-content');
    const editBtn = div.querySelector('.enableEdit');
    const saveBtn = div.querySelector('.saveEdit');
    const deleteBtn = div.querySelector('.deleteNote');

    // Enable editing
    editBtn.addEventListener('click', () => {
      titleField.disabled = false;
      contentField.disabled = false;
      saveBtn.style.display = 'inline-block';
      editBtn.style.display = 'none';
    });

    // Save changes
    saveBtn.addEventListener('click', async () => {
      const updatedNote = {
        title: titleField.value.trim(),
        content: contentField.value.trim()
      };

      await fetch(`/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote)
      });

      titleField.disabled = true;
      contentField.disabled = true;
      saveBtn.style.display = 'none';
      editBtn.style.display = 'inline-block';

      fetchNotes();
    });

    // Delete note
    deleteBtn.addEventListener('click', async () => {
      await fetch(`/notes/${note.id}`, { method: 'DELETE' });
      fetchNotes();
    });

    notesList.appendChild(div);
  });
}

// Add new note
form.addEventListener('submit', async e => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  if (!title || !content) return alert('Both fields are required.');

  await fetch('/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  });

  form.reset();
  fetchNotes();
});

// Initial load
fetchNotes();
