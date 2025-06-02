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
    cartBox.style.top = '60px';
    cartBox.style.right = '20px';
    cartBox.style.width = '300px';
    cartBox.style.maxHeight = '400px';
    cartBox.style.overflowY = 'auto';
    cartBox.style.backgroundColor = 'white';
    cartBox.style.border = '1px solid #ccc';
    cartBox.style.padding = '10px';
    cartBox.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
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
      addBtn.style.cursor = 'pointer';
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
    cartBtn.style.padding = '10px 15px';
    cartBtn.style.fontSize = '16px';
    cartBtn.style.cursor = 'pointer';
    cartBtn.style.borderRadius = '5px';
    cartBtn.style.border = '1px solid #333';
    cartBtn.style.backgroundColor = '#eee';
    document.body.appendChild(cartBtn);

    cartBtn.onclick = () => {
      cartBox.style.display = cartBox.style.display === 'none' ? 'block' : 'none';
      updateCart();
    };

    document.addEventListener('click', (e) => {
      if (!cartBox.contains(e.target) && e.target !== cartBtn) {
        cartBox.style.display = 'none';
      }
    });

    function updateCart() {
      cartBox.innerHTML = '<h3>Cart</h3>';

      if (cart.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.innerText = 'Cart is empty.';
        cartBox.appendChild(emptyMsg);
        return;
      }

      let total = 0;

      cart.forEach((item, idx) => {
        const itemDiv = document.createElement('div');
        itemDiv.style.display = 'flex';
        itemDiv.style.alignItems = 'center';
        itemDiv.style.justifyContent = 'space-between';
        itemDiv.style.marginBottom = '8px';

        const descSpan = document.createElement('span');
        let descText = item.description.length > 20
          ? item.description.slice(0, 20) + '...'
          : item.description;
        descSpan.innerText = descText;
        descSpan.style.flex = '1';

        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.min = 1;
        qtyInput.value = item.quantity;
        qtyInput.style.width = '40px';
        qtyInput.style.margin = '0 8px';
        qtyInput.onchange = () => {
          let val = parseInt(qtyInput.value);
          if (isNaN(val) || val < 1) val = 1;
          qtyInput.value = val;
          cart[idx].quantity = val;
          localStorage.setItem('cart', JSON.stringify(cart));
          updateCart();
        };

        const priceSpan = document.createElement('span');
        const price = item.price * item.quantity;
        priceSpan.innerText = `$${price.toFixed(2)}`;
        priceSpan.style.width = '60px';
        priceSpan.style.textAlign = 'right';

        const removeBtn = document.createElement('button');
        removeBtn.innerText = 'Remove';
        removeBtn.style.marginLeft = '8px';
        removeBtn.style.cursor = 'pointer';
        removeBtn.onclick = () => {
          cart.splice(idx, 1);
          localStorage.setItem('cart', JSON.stringify(cart));
          updateCart();
        };

        itemDiv.appendChild(descSpan);
        itemDiv.appendChild(qtyInput);
        itemDiv.appendChild(priceSpan);
        itemDiv.appendChild(removeBtn);
        cartBox.appendChild(itemDiv);

        total += price;
      });

      const tax = total * 0.05;
      const shipping = cart.length > 0 ? 10 : 0;
      const grandTotal = total + tax + shipping;

      const summary = document.createElement('div');
      summary.style.borderTop = '1px solid #ccc';
      summary.style.paddingTop = '10px';
      summary.style.marginTop = '10px';
      summary.style.fontSize = '14px';

      summary.innerHTML = `
        <div>Subtotal: $${total.toFixed(2)}</div>
        <div>Tax (5%): $${tax.toFixed(2)}</div>
        <div>Shipping: $${shipping.toFixed(2)}</div>
        <strong>Total: $${grandTotal.toFixed(2)}</strong>
      `;
      cartBox.appendChild(summary);
    }

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
      note.style.zIndex = '1100';
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
