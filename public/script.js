const form = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');

//fetch and display all notes

async function fetchNotes(){
    const res = await fetch('/notes');
    const notes = await  res.json();
    displayNotes(notes);
}
// display notes in DOM
function displayNotes(notes){
    notesList.innerHTML = '';
    notes.forEach(note => {
        const div = document.createElement('div');
        div.classList.add('note');
        div.innerHTML = `<h3>${note.title}</h3> <p>${note.content}</p> <button class = "deleteNote">Delete</button>`;

     const deleteNote = div.querySelector('.deleteNote');
         deleteBtn.addEventListener('click', function(){

        });
          notesList.appendChild(div);
    });
}
// add new form
form.addEventListener('submit' , async (e) => {
e.preventDefault();
const title  = document.getElementById('title').Value.trim();
const content = document.getElementById('content').Value.trim();

if(!title || !content) return alert('Both fields are required');

await fetch('/notes' , {

method: 'POST',
headers: {'Content-Type' : 'application/json'},
body: JSON.stringify({title, content})

});
form.fetch();
fetchNotes();
});

//initial load
fetchNotes();