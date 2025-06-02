fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const excludedCols = ['cost', 'supplier', 'department', 'date', 'markup', 'UoM'].map(c => c.toLowerCase());
    const table = document.getElementById('data-table');
    if (!data.length) return;

    // Filter headers (case-insensitive)
    const headers = Object.keys(data[0]).filter(h => !excludedCols.includes(h.toLowerCase()));

    // Create header row
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
      const th = document.createElement('th');
      th.innerText = header;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Create data rows with unique IDs
    data.forEach((row, index) => {
      const tr = document.createElement('tr');

      // Create a simple unique ID based on part name or part number (first match)
      // Adjust the keys if your JSON keys differ
      const partName = row['part name'] || row['Part Name'] || row['name'] || '';
      const partNumber = row['part number'] || row['Part Number'] || row['number'] || '';

      // Use index to guarantee unique ID
      tr.id = `row-${index}`;

      headers.forEach(header => {
        const td = document.createElement('td');
        td.innerText = row[header];
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    function clearHighlights() {
      const rows = table.querySelectorAll('tr');
      rows.forEach(r => r.style.backgroundColor = '');
    }

    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) return;

      clearHighlights();

      // Search through rows
      let foundRow = null;
      for (let i = 1; i < table.rows.length; i++) { // skip header row (index 0)
        const cells = table.rows[i].cells;
        // Assuming part name and part number are among visible columns, check each cell
        for (let cell of cells) {
          if (cell.innerText.toLowerCase().includes(query)) {
            foundRow = table.rows[i];
            break;
          }
        }
        if (foundRow) break;
      }

      if (foundRow) {
        // Highlight and scroll into view
        foundRow.style.backgroundColor = '#ffff99'; // highlight color
        foundRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert('No matching part found.');
      }
    });

    // Optional: trigger search on Enter key press
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        searchBtn.click();
      }
    });
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });
