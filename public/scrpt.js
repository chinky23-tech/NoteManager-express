const form = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');
const toast = document.getElementById('toast');

// 🌗 Dark / Light mode toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const dark = document.body.classList.contains('dark-mode');
  themeToggle.textContent = dark ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
});

// Restore theme on load
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggle.textContent = '☀️ Light Mode';
}

// 💬 Toast message function
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Fetch and display notes (from server or localStorage)
async function fetchNotes() {
  try {
    const res = await fetch('/notes');
    const notes = await res.json();
    localStorage.setItem('notesBackup', JSON.stringify(notes));
    displayNotes(notes);
  } catch {
    // fallback if offline
    const backup = localStorage.getItem('notesBackup');
    if (backup) displayNotes(JSON.parse(backup));
  }
}

// Display notes
function displayNotes(notes) {
  notesList.innerHTML = '';
  const search = searchInput.value.toLowerCase();

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search)
  );

  if (filtered.length === 0) {
    notesList.innerHTML = '<p>No notes found...</p>';
    return;
  }

  filtered.forEach(note => {
    const div = document.createElement('div');
    div.classList.add('note');
    div.innerHTML = `
      <input type="text" class="edit-title" value="${note.title}" disabled />
      <textarea class="edit-content" disabled>${note.content}</textarea>
      <div class="btn-group">
        <button onclick="enableEdit(${note.id}, this)">Edit</button>
        <button onclick="saveEdit(${note.id}, this)" style="display:none;">Save</button>
        <button onclick="deleteNote(${note.id})">Delete</button>
      </div>
    `;
    notesList.appendChild(div);
  });
}

// Add note
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();

  if (!title || !content) return alert('Both fields are required');

  await fetch('/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  });

  form.reset();
  showToast('✅ Note added!');
  fetchNotes();
});

// Delete note
async function deleteNote(id) {
  await fetch(`/notes/${id}`, { method: 'DELETE' });
  showToast('🗑️ Note deleted!');
  fetchNotes();
}

// Enable editing
function enableEdit(id, btn) {
  const noteDiv = btn.closest('.note');
  const titleInput = noteDiv.querySelector('.edit-title');
  const contentInput = noteDiv.querySelector('.edit-content');
  const saveBtn = noteDiv.querySelector('button:nth-child(2)');

  titleInput.disabled = false;
  contentInput.disabled = false;
  btn.style.display = 'none';
  saveBtn.style.display = 'inline-block';
}

// Save edited note
async function saveEdit(id, btn) {
  const noteDiv = btn.closest('.note');
  const title = noteDiv.querySelector('.edit-title').value.trim();
  const content = noteDiv.querySelector('.edit-content').value.trim();
  const editBtn = noteDiv.querySelector('button:nth-child(1)');

  if (!title || !content) return alert('Both fields are required');

  await fetch(`/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  });

  noteDiv.querySelector('.edit-title').disabled = true;
  noteDiv.querySelector('.edit-content').disabled = true;
  btn.style.display = 'none';
  editBtn.style.display = 'inline-block';

  showToast('💾 Note saved!');
  fetchNotes();
}

// 🔍 Live Search
searchInput.addEventListener('input', fetchNotes);

// Load notes on startup
fetchNotes();
