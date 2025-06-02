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
      th.innerText = header;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    const cart = {};

    data.forEach((row, index) => {
      const tr = document.createElement('tr');
      tr.id = `row-${index}`;

      headers.forEach(header => {
        const td = document.createElement('td');

        if (header === 'Add to Cart') {
          const btn = document.createElement('button');
          btn.innerText = 'Add';
          btn.style.cursor = 'pointer';
          btn.addEventListener('click', () => {
            const key = row['part number'] || row['Part Number'] || row['number'] || index;
            cart[key] = row;
            showToast(`Added item to cart.`);
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

    const cartBtn = document.createElement('button');
    cartBtn.innerText = '🛒 View Cart (0)';
    cartBtn.id = 'cart-btn';
    cartBtn.style.position = 'fixed';
    cartBtn.style.top = '20px';
    cartBtn.style.right = '20px';
    cartBtn.style.padding = '10px 15px';
    cartBtn.style.zIndex = '1001';
    cartBtn.style.cursor = 'pointer';
    cartBtn.style.background = '#007BFF';
    cartBtn.style.color = '#fff';
    cartBtn.style.border = 'none';
    cartBtn.style.borderRadius = '6px';
    cartBtn.style.fontSize = '15px';
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
    cartPopup.style.borderRadius = '6px';
    document.body.appendChild(cartPopup);

    cartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (cartPopup.style.display === 'none') {
        renderCart();
        cartPopup.style.display = 'block';
      } else {
        cartPopup.style.display = 'none';
      }
    });

    document.addEventListener('click', (e) => {
      if (!cartPopup.contains(e.target) && e.target !== cartBtn) {
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

      let total = 0;

      keys.forEach(key => {
        const item = cart[key];
        const desc = (item['description'] || item['Description'] || 'Unnamed item').slice(0, 20) + '...';
        const cost = parseFloat(item['price'] || item['Price'] || 0);
        total += cost;

        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.style.borderBottom = '1px solid #ddd';
        div.style.padding = '5px 0';

        const left = document.createElement('span');
        left.innerText = desc;

        const right = document.createElement('div');
        right.style.display = 'flex';
        right.style.alignItems = 'center';
        right.innerHTML = `<span style="margin-right: 10px;">$${cost.toFixed(2)}</span>`;

        const removeBtn = document.createElement('button');
        removeBtn.innerText = '✖';
        removeBtn.style.background = 'none';
        removeBtn.style.border = 'none';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.color = 'red';
        removeBtn.title = 'Remove';

        removeBtn.onclick = () => {
          delete cart[key];
          renderCart();
          updateCartCount();
        };

        right.appendChild(removeBtn);
        div.appendChild(left);
        div.appendChild(right);
        cartPopup.appendChild(div);
      });

      const totalDiv = document.createElement('div');
      totalDiv.style.marginTop = '10px';
      totalDiv.style.fontWeight = 'bold';
      totalDiv.style.textAlign = 'right';
      totalDiv.innerText = `Total: $${total.toFixed(2)}`;
      cartPopup.appendChild(totalDiv);
    }

    function updateCartCount() {
      const count = Object.keys(cart).length;
      cartBtn.innerText = `🛒 View Cart (${count})`;
    }
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });
