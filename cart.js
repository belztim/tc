let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartBox, cartBtn, tableData;

export function initCart(data) {
  tableData = data;

  cartBox = document.createElement('div');
  cartBox.id = 'cart-box';
  Object.assign(cartBox.style, {
    display: 'none',
    position: 'fixed',
    top: '60px',
    right: '20px',
    width: '320px',
    maxHeight: '450px',
    overflowY: 'auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #ddd',
    padding: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
    zIndex: '1000',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
  });
  document.body.appendChild(cartBox);

  cartBtn = document.createElement('button');
  cartBtn.id = 'view-cart-btn';
  cartBtn.innerText = 'View Cart';
  Object.assign(cartBtn.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '25px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    boxShadow: '0 3px 8px rgba(76,175,80,0.4)',
    transition: 'background-color 0.3s ease',
  });
  cartBtn.onmouseenter = () => cartBtn.style.backgroundColor = '#45a049';
  cartBtn.onmouseleave = () => cartBtn.style.backgroundColor = '#4CAF50';
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

  attachAddButtons();
  updateCart();
}

function attachAddButtons() {
  document.querySelectorAll('#data-table td.cart-cell').forEach((td, idx) => {
    td.innerHTML = ''; // Clear before adding
    const addBtn = document.createElement('button');
    addBtn.innerText = 'Add';
    Object.assign(addBtn.style, {
      cursor: 'pointer',
      padding: '6px 14px',
      fontSize: '14px',
      borderRadius: '20px',
      border: '1.5px solid #4CAF50',
      backgroundColor: 'white',
      color: '#4CAF50',
      fontWeight: '600',
      boxShadow: '0 2px 5px rgba(76,175,80,0.2)',
      transition: 'all 0.3s ease',
      userSelect: 'none',
    });
    addBtn.onmouseenter = () => {
      addBtn.style.backgroundColor = '#4CAF50';
      addBtn.style.color = 'white';
      addBtn.style.boxShadow = '0 4px 12px rgba(76,175,80,0.5)';
    };
    addBtn.onmouseleave = () => {
      addBtn.style.backgroundColor = 'white';
      addBtn.style.color = '#4CAF50';
      addBtn.style.boxShadow = '0 2px 5px rgba(76,175,80,0.2)';
    };

    addBtn.onclick = (e) => {
      e.stopPropagation(); // Prevent cart close on Add button click

      const rowData = tableData[idx];
      const item = {
        description: rowData['Description'] || 'n/a',
        price: parseFloat(rowData['Price'] || 0),
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

      // Keep cart open after adding an item
      cartBox.style.display = 'block';
    };

    td.appendChild(addBtn);
  });
}

function updateCart() {
  cartBox.innerHTML = '<h3 style="margin-top:0; margin-bottom: 15px; font-weight: 700; color: #4CAF50;">Your Cart</h3>';

  if (cart.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.innerText = 'Your cart is empty.';
    Object.assign(emptyMsg.style, {
      fontStyle: 'italic',
      color: '#777',
      textAlign: 'center',
      marginTop: '50px',
      userSelect: 'none',
    });
    cartBox.appendChild(emptyMsg);
    return;
  }

  let total = 0;

  cart.forEach((item, idx) => {
    const itemDiv = document.createElement('div');
    Object.assign(itemDiv.style, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '10px',
      padding: '6px 8px',
      borderRadius: '6px',
      backgroundColor: '#f9f9f9',
      boxShadow: 'inset 0 0 3px rgba(0,0,0,0.05)',
    });

    const descSpan = document.createElement('span');
    let descText = item.description.length > 25
      ? item.description.slice(0, 25) + '...'
      : item.description;
    descSpan.innerText = descText;
    descSpan.style.flex = '1';
    descSpan.style.fontWeight = '600';

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = 1;
    qtyInput.value = item.quantity;
    Object.assign(qtyInput.style, {
      width: '45px',
      margin: '0 10px',
      padding: '3px 5px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '14px',
      textAlign: 'center',
    });
    qtyInput.onchange = () => {
      let val = parseInt(qtyInput.value);
      if (isNaN(val) || val < 1) val = 1;
      qtyInput.value = val;
      cart[idx].quantity = val;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
      cartBox.style.display = 'block'; // Keep cart open after qty change
    };

    const priceSpan = document.createElement('span');
    const price = item.price * item.quantity;
    priceSpan.innerText = `$${price.toFixed(2)}`;
    Object.assign(priceSpan.style, {
      width: '65px',
      textAlign: 'right',
      fontWeight: '600',
      color: '#333',
      fontVariantNumeric: 'tabular-nums',
    });

    const removeBtn = document.createElement('button');
    removeBtn.innerText = '×';
    Object.assign(removeBtn.style, {
      marginLeft: '12px',
      cursor: 'pointer',
      backgroundColor: '#ff5252',
      border: 'none',
      color: 'white',
      borderRadius: '50%',
      width: '22px',
      height: '22px',
      fontWeight: '700',
      lineHeight: '22px',
      fontSize: '16px',
      padding: '0',
      userSelect: 'none',
      boxShadow: '0 2px 5px rgba(255,82,82,0.4)',
      transition: 'background-color 0.3s ease',
    });
    removeBtn.onmouseenter = () => removeBtn.style.backgroundColor = '#e04848';
    removeBtn.onmouseleave = () => removeBtn.style.backgroundColor = '#ff5252';

    removeBtn.onclick = (e) => {
      e.stopPropagation(); // Prevent closing cart on remove
      cart.splice(idx, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
      cartBox.style.display = 'block'; // Keep cart open after remove
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
  Object.assign(summary.style, {
    borderTop: '1px solid #ddd',
    paddingTop: '15px',
    marginTop: '15px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#444',
    lineHeight: '1.4',
  });

  summary.innerHTML = `
    <div>Subtotal: $${total.toFixed(2)}</div>
    <div>Tax (5%): $${tax.toFixed(2)}</div>
    <div>Shipping: $${shipping.toFixed(2)}</div>
    <strong style="font-size: 17px; color: #4CAF50;">Total: $${grandTotal.toFixed(2)}</strong>
  `;
  cartBox.appendChild(summary);
}

document.addEventListener('DOMContentLoaded', () => {
  // Optional auto-init here
  // initCart(yourDataHere);
});
