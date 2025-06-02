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

    // Create data rows with an id for scrolling
    data.forEach((row, index) => {
      const tr = document.createElement('tr');
      // Add an id to each row for scroll targeting (use part number or index fallback)
      tr.id = `row-${index}`;
      headers.forEach(header => {
        const td = document.createElement('td');
        td.innerText = row[header];
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    // Search function
    function searchTable() {
      const input = document.getElementById('search-input').value.trim().toLowerCase();
      if (!input) return;

      // Find the index of part name or part number columns
      const partNameColIndex = headers.findIndex(h => h.toLowerCase().includes('part name'));
      const partNumColIndex = headers.findIndex(h => h.toLowerCase().includes('part number') || h.toLowerCase().includes('part no'));

      for (let i = 0; i < data.length; i++) {
        const partName = data[i][headers[partNameColIndex]]?.toLowerCase() || '';
        const partNum = data[i][headers[partNumColIndex]]?.toLowerCase() || '';

        if (partName.includes(input) || partNum.includes(input)) {
          const row = document.getElementById(`row-${i}`);
          if (row) {
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Optional: highlight found row briefly
            row.style.backgroundColor = '#ffff99';
            setTimeout(() => {
              row.style.backgroundColor = '';
            }, 2000);
          }
          return; // Stop after first match
        }
      }

      alert('No matching part name or part number found.');
    }

    // Attach event listener to search button
    document.getElementById('search-btn').addEventListener('click', searchTable);

    // Optional: also trigger search on Enter key
    document.getElementById('search-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') searchTable();
    });
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });
