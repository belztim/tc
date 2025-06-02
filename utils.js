export function clearHighlights(table) {
  const rows = table.querySelectorAll('tr');
  rows.forEach(r => r.style.backgroundColor = '');
}

export function flashMessage(msg) {
  const note = document.createElement('div');
  note.innerText = msg;
  Object.assign(note.style, {
    position: 'fixed',
    top: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#444',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    zIndex: '1100'
  });
  document.body.appendChild(note);
  setTimeout(() => document.body.removeChild(note), 2000);
}
