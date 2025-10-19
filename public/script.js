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
     <input type = "text" class = "edit-title" value ="${note.title}" disabled/>
     <textarea class = "edit-content" disabled>${note.content}</textarea>
      <div class = "btn-group">
      <button class="editBtn">Edit</button>
      <button class="saveBtn">Save</button>
      <button class="deleteBtn">Delete</button>
      </div>
    `;

const titleInput = div.querySelector('.edit-title');
const contentInput = div.querySelector('.edit-content');
const editBtn = div.querySelector('.editBtn');
const saveBtn = div.querySelector('.saveBtn');
const deleteBtn = div.querySelector('.deleteBtn');
//enable editing

editBtn.addEventListener('click', () => {
titleInput.disabled = false;
contentInput.disabled = false;
editBtn.style.display = 'none';
saveBtn.style.display = 'inline-block';
});

// save updated note
saveBtn.addEventListener('click' , async () => {
const updatedTitle = titleInput.value.trim();
const updatedContent = titleInput.value.trim();

if(!updatedTitle || !updatedContent) return alert('Both fields are required');
try{
  await fetch(`/notes/${note.id}`,{
  
    method : 'PUT',
    headers : {'Content-Type': 'application/json'},
    body: JSON.stringify({title: updatedTitle, content: updatedContent})
  });
  fetchNotes();
}catch(err){
  console.error('Error updating note:', err);
}


});
 }
)}
   
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
