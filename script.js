fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const excludedCols = ['cost', 'supplier', 'department', 'date', 'markup', 'UoM'].map(c => c.toLowerCase());
    const table = document.getElementById('data-table');
    if (!data.length) return;

    // Filter headers (case-insensitive)
    const headers = Object.keys(data[0]).filter(h => !excludedCols.includes(h.toLowerCase()));

    // Add an extra header for Add to Cart
    headers.push('Add to Cart');

    // Create header row
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
      const th = document.createElement('th');
      th.innerText = header === 'Add to Cart' ? '' : header;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Cart array to store added items
    const cart = [];

    // Create data rows with unique IDs
    data.forEach((row, index) => {
      const tr = document.createElement('tr');

      tr.id = `row-${index}`;

      headers.forEach(header => {
        const td = document.createElement('td');

        if (header === 'Add to Cart') {
          const btn = document.createElement('button');
          btn.innerText = 'Add to Cart';
          btn.style.cursor = 'pointer';
          btn.addEventListener('click', () => {
            cart.push(row);
            updateCartCount();
            alert(`Added "${row['part name'] || row['Part Name'] || 'item'}" to cart!`);
          });
          td.appendChild(btn);
        } else {
          td.innerText = row[header] || '';
        }

        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    // Add cart display element to page
    const cartDiv = document.createElement('div');
    cartDiv.id = 'cart-display';
    cartDiv.style.position = 'fixed';
    cartDiv.style.top = '10px';
    cartDiv.style.right = '10px';
    cartDiv.style.backgroundColor = '#2980b9';
    cartDiv.style.color = 'white';
    cartDiv.style.padding = '10px 15px';
    cartDiv.style.borderRadius = '5px';
    cartDiv.style.fontWeight = 'bold';
    cartDiv.style.cursor = 'default';
    cartDiv.innerHTML = `Cart: <span id="cart-count">0</span> items`;
    document.body.appendChild(cartDiv);

    function updateCartCount() {
      const cartCount = document.getElementById('cart-count');
      if (cartCount) {
        cartCount.innerText = cart.length;
      }
    }

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

      let foundRow = null;
      for (let i = 1; i < table.rows.length; i++) { // skip header
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
        alert('No matching part found.');
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchBtn.click();
      }
    });
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });

