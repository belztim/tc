fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const excludedCols = ['cost', 'supplier', 'department', 'date', 'markup', 'UoM'].map(c => c.toLowerCase());
    const table = document.getElementById('data-table');
    if (!data.length) return;

    const headers = Object.keys(data[0]).filter(h => !excludedCols.includes(h.toLowerCase()));
    headers.push('Add to Cart');

    const headerRow = document.createElement('tr');
    headers.forEach(header => {
      const th = document.createElement('th');
      th.innerText = header === 'Add to Cart' ? '' : header;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    const cart = [];

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
            showToast(`Added "${row['part name'] || row['Part Name'] || 'item'}" to cart!`);
            updateCartView();
          });
          td.appendChild(btn);
        } else {
          td.innerText = row[header] || '';
        }

        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    // Cart display (top-right) with button to toggle cart popup
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
    cartDiv.style.cursor = 'pointer';
    cartDiv.title = 'Click to view cart';
    cartDiv.innerHTML = `Cart: <span id="cart-count">0</span> items`;
    document.body.appendChild(cartDiv);

    // Cart popup container (hidden by default)
    const cartPopup = document.createElement('div');
    cartPopup.id = 'cart-popup';
    Object.assign(cartPopup.style, {
      position: 'fixed',
      top: '50px',
      right: '10px',
      width: '300px',
      maxHeight: '400px',
      overflowY: 'auto',
      backgroundColor: 'white',
      border: '2px solid #2980b9',
      borderRadius: '8px',
      padding: '10px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      display: 'none',
      zIndex: '9999',
    });
    document.body.appendChild(cartPopup);

    // Close button for cart popup
    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Close';
    closeBtn.style.marginBottom = '10px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.addEventListener('click', () => {
      cartPopup.style.display = 'none';
    });
    cartPopup.appendChild(closeBtn);

    // Container inside popup to hold cart items list
    const cartItemsList = document.createElement('div');
    cartPopup.appendChild(cartItemsList);

    // Update cart count
    function updateCartCount() {
      const cartCount = document.getElementById('cart-count');
      if (cartCount) cartCount.innerText = cart.length;
    }

    // Update cart popup content
    function updateCartView() {
      cartItemsList.innerHTML = '';
      if (cart.length === 0) {
        cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
        return;
      }
      cart.forEach((item, idx) => {
        const div = document.createElement('div');
        div.style.borderBottom = '1px solid #ddd';
        div.style.padding = '5px 0';
        div.innerText = `${item['part name'] || item['Part Name'] || 'Item'} - ${item['part number'] || item['Part Number'] || ''}`;
        cartItemsList.appendChild(div);
      });
    }

    // Toggle cart popup on cartDiv click
    cartDiv.addEventListener('click', () => {
      if (cartPopup.style.display === 'none') {
        updateCartView();
        cartPopup.style.display = 'block';
      } else {
        cartPopup.style.display = 'none';
      }
    });

    // Toast popup for messages
    const toast = document.createElement('div');
    toast.id = 'toast-popup';
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#333',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      opacity: '0',
      transition: 'opacity 0.5s ease',
      pointerEvents: 'none',
      zIndex: '10000',
    });
    document.body.appendChild(toast);

    function showToast(message) {
      toast.textContent = message;
      toast.style.opacity = '1';
      setTimeout(() => {
        toast.style.opacity = '0';
      }, 2000);
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
        showToast('No matching part found.');
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

