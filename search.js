import { flashMessage, clearHighlights } from './utils.js';

export function initSearch(table) {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;
    clearHighlights(table);
    let foundRow = null;
    for (let i = 1; i < table.rows.length; i++) {
      const cells = table.rows[i].cells;
      for (let cell of cells) {
        if (cell.innerText.toLowerCase().includes(query)) {
          foundRow = table.rows[i];
          break;
        }
      }
      if (foundRow) break;
    }
    if (foundRow) {
      foundRow.style.backgroundColor = '#ffff99';
      foundRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      flashMessage('No matching part found.');
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchBtn.click();
    }
  });
}
