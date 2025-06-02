fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const excludedCols = ['cost', 'supplier', 'department', 'date', 'markup', 'UoM'].map(c => c.toLowerCase());
    const table = document.getElementById('data-table');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBox = document.createElement('div');
    cartBox.id = 'cart-box';
    cartBox.style.display = 'none';
    cartBox.style.position = 'fixed';
    cartBox.style.top = '80px';
    cartBox.style.right = '20px';
    cartBox.style.width = '300px';
    cartBox.style.background = 'white';
    cartBox.style.border = '1px solid #ccc';
    cartBox.style.padding = '10px';
    cartBox.style.borderRadius = '6px';
    cartBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    cartBox.style.zIndex = '1000';
    document.body.appendChild(cartBox);

    if (!data.length) return;

    const headers = Object.keys(data[0]).filter(h => !excludedCols.includes(h.toLowerCase()));

    const headerRow = document.createElement('tr');
    headers.forEach(header => {
      const th = document.createElement('th');
      th.innerText = header;
      headerRow.appendChild(th);
    });
    const thCart = document.createElement('th');
    thCart.innerText = 'Add to Cart';
    headerRow.appendChild(thCart);
    table.appendChild(headerRow);

    data.forEach((row, index) => {
      const tr = document.createElement('tr');
      tr.id = `row-${index}`;

      headers.forEach(header => {
        const td = document.createElement('td');
        td.innerText = row[header];
        tr.appendChild(td);
      });

      const cartTd = document.createElement('td');
      const addBtn = document.createElement('button');
      addBtn.innerText = 'Add';
      addBtn.onclick = () => {
        const item = {
          description: row['description'] || 'n/a',
          price: parseFloat(row['price'] || 0),
          quantity: 1
        };
        const existing = cart.find(i => i.description === item.description);
        if (existing) {
          existing.quantity++;
        } else {
          cart.push(item);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
      };
      cartTd.appendChild(addBtn);
      tr.appendChild(cartTd);

      table.appendChild(tr);
    });

    const cartBtn = document.createElement('button');
    cartBtn.id = 'view-cart-btn';
    cartBtn.innerText = 'View Cart';
    cartBtn.style.position = 'fixed';
    cartBtn.style.top = '20px';
    cartBtn.style.right = '20px';
    cartBtn.style.padding = '8px 12px';
    cartBtn.style.fontSize = '16px';
    cartBtn.style.backgroundColor = '#007bff';
    cartBtn.style.color = 'white';
    cartBtn.style.border = 'none';
    cartBtn.style.borderRadius = '4px';
    cartBtn.style.cursor = 'pointer';
    document.body.appendChild(cartBtn);

    cartBtn.onclick = (e) => {
      cartBox.style.display = cartBox.style.display === 'none' ? 'block' : 'none';
      updateCart();
      e.stopPropagation();
    };

    document.addEventListener('click', (e) => {
      if (!cartBox.contains(e.target) && e.target !== cartBtn) {
        cartBox.style.display = 'none';
      }
    });

    function updateCart() {
      cartBox.innerHTML = '<h3>Cart</h3>';
      let total = 0;
      cart.forEach((item, idx) => {
        const itemDiv = document.createElement('div');
        const price = item.price * item.quantity;
        total += price;
        const desc = item.description.length > 20 ? item.description.slice(0, 20) + '...' : item.description;
        itemDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span>${desc}</span>
            <span>$${price.toFixed(2)}</span>
            <button onclick="removeFromCart(${idx})" style="margin-left: 10px; cursor: pointer;">✕</button>
          </div>
        `;
        cartBox.appendChild(itemDiv);
      });
      const tax = total * 0.05;
      const shipping = cart.length > 0 ? 10 : 0;
      const grandTotal = total + tax + shipping;
      const summary = document.createElement('div');
      summary.innerHTML = `
        <hr>
        <div>Subtotal: $${total.toFixed(2)}</div>
        <div>Tax (5%): $${tax.toFixed(2)}</div>
        <div>Shipping: $${shipping.toFixed(2)}</div>
        <strong>Total: $${grandTotal.toFixed(2)}</strong>
      `;
      cartBox.appendChild(summary);
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    window.removeFromCart = (index) => {
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
    };

    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    function clearHighlights() {
      const rows = table.querySelectorAll('tr');
      rows.forEach(r => r.style.backgroundColor = '');
    }

    function flashMessage(msg) {
      const note = document.createElement('div');
      note.innerText = msg;
      note.style.position = 'fixed';
      note.style.top = '10px';
      note.style.left = '50%';
      note.style.transform = 'translateX(-50%)';
      note.style.backgroundColor = '#444';
      note.style.color = 'white';
      note.style.padding = '10px';
      note.style.borderRadius = '5px';
      document.body.appendChild(note);
      setTimeout(() => document.body.removeChild(note), 2000);
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
        flashMessage('No matching part found.');
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchBtn.click();
      }
    });

    const uniqueBrands = [...new Set(data.map(d => d['brand']).filter(Boolean))];
    const filterContainer = document.createElement('div');
    filterContainer.style.marginBottom = '10px';
    uniqueBrands.forEach(brand => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = brand;
      checkbox.onchange = () => applyFilters();
      label.appendChild(checkbox);
      label.append(` ${brand} `);
      filterContainer.appendChild(label);
    });
    table.parentElement.insertBefore(filterContainer, table);

    function applyFilters() {
      const checked = Array.from(filterContainer.querySelectorAll('input:checked')).map(cb => cb.value);
      for (let i = 1; i < table.rows.length; i++) {
        const brandCell = table.rows[i].querySelector('td');
        const rowBrand = brandCell?.innerText;
        table.rows[i].style.display = (checked.length === 0 || checked.includes(rowBrand)) ? '' : 'none';
      }
    }
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });
