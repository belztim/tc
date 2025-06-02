fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const excludedCols = ['cost', 'supplier', 'department', 'date', 'markup', 'UoM'].map(c => c.toLowerCase());
    const table = document.getElementById('data-table');
    if (!data.length) return;

    // Filter headers (case-insensitive)
    const headers = Object.keys(data[0]).filter(h => !excludedCols.includes(h.toLowerCase()));

    // Add a header for "Add to Cart" button
    headers.push('Add to Cart');

    // Create header row
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
      const th = document.createElement('th');
      th.innerText = header;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Cart object to store added items
    const cart = {};

    // Create data rows with unique IDs
    data.forEach((row, index) => {
      const tr = document.createElement('tr');

      // Use index to guarantee unique ID
      tr.id = `row-${index}`;

      headers.forEach(header => {
        const td = document.createElement('td');

        if (header === 'Add to Cart') {
          const btn = document.createElement('button');
          btn.innerText = 'Add';
          btn.style.cursor = 'pointer';
          btn.addEventListener('click', () => {
            // Add item to cart
            const key = row['part number'] || row['Part Number'] || row['number'] || index;
            cart[key] = row;
            showToast(`Added ${row['part name'] || row['Part Name'] || 'item'} to cart.`);
            updateCartCount();
          });
          td.appendChild(btn);
        } else {
          td.innerText = row[header];
        }
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
      for (let i = 1; i < table.rows.length; i++) { // skip header row
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
        foundRow.style.backgroundColor = '#ffff99'; // highlight
        foundRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        showToast('No matching part found.');
      }
    });

    // Trigger search on Enter key
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();  // prevent default
        searchBtn.click();
      }
    });

    // Toast notification function
    function showToast(message) {
      let toast = document.getElementById('toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = '#333';
        toast.style.color = '#fff';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.opacity = '0.9';
        toast.style.zIndex = '1000';
        toast.style.transition = 'opacity 0.5s ease-in-out';
        document.body.appendChild(toast);
      }
      toast.innerText = message;
      toast.style.opacity = '0.9';
      setTimeout(() => {
        toast.style.opacity = '0';
      }, 2000);
    }

    // Cart popup and button setup
    const cartBtn = document.createElement('button');
    cartBtn.innerText = 'View Cart (0)';
    cartBtn.id = 'cart-btn';
    cartBtn.style.position = 'fixed';
    cartBtn.style.top = '20px';
    cartBtn.style.right = '20px';
    cartBtn.style.padding = '10px 15px';
    cartBtn.style.zIndex = '1001';
    cartBtn.style.cursor = 'pointer';
    document.body.appendChild(cartBtn);

    const cartPopup = document.createElement('div');
    cartPopup.id = 'cart-popup';
    cartPopup.style.position = 'fixed';
    cartPopup.style.top = '60px';
    cartPopup.style.right = '20px';
    cartPopup.style.width = '300px';
    cartPopup.style.maxHeight = '400px';
    cartPopup.style.overflowY = 'auto';
    cartPopup.style.backgroundColor = '#fff';
    cartPopup.style.border = '1px solid #ddd';
    cartPopup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    cartPopup.style.padding = '10px';
    cartPopup.style.display = 'none';
    cartPopup.style.zIndex = '1002';
    document.body.appendChild(cartPopup);

    cartBtn.addEventListener('click', () => {
      if (cartPopup.style.display === 'none') {
        renderCart();
        cartPopup.style.display = 'block';
      } else {
        cartPopup.style.display = 'none';
      }
    });

    function renderCart() {
      cartPopup.innerHTML = '<h3>Cart Items</h3>';
      const keys = Object.keys(cart);
      if (!keys.length) {
        cartPopup.innerHTML += '<p>Your cart is empty.</p>';
        return;
      }

      keys.forEach(key => {
        const item = cart[key];
        const div = document.createElement('div');
        div.style.borderBottom = '1px solid #ddd';
        div.style.padding = '5px 0';
        div.innerText = `${item['part name'] || item['Part Name'] || 'Item'} - ${item['part number'] || item['Part Number'] || 'N/A'}`;
        cartPopup.appendChild(div);
      });
    }

    function updateCartCount() {
      const count = Object.keys(cart).length;
      cartBtn.innerText = `View Cart (${count})`;
    }
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });

