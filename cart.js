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
    width: '300px',
    maxHeight: '400px',
    overflowY: 'auto',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    padding: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    zIndex: '1000'
  });
  document.body.appendChild(cartBox);

  cartBtn = document.createElement('button');
  cartBtn.id = 'view-cart-btn';
  cartBtn.innerText = 'View Cart';
  Object.assign(cartBtn.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '10px 15px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: '1px solid #333',
    backgroundColor: '#eee'
  });
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
    addBtn.style.cursor = 'pointer';

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
    Object.assign(itemDiv.style, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '8px'
    });

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
      cartBox.style.display = 'block'; // Keep cart open after qty change
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
    borderTop: '1px solid #ccc',
    paddingTop: '10px',
    marginTop: '10px',
    fontSize: '14px'
  });

  summary.innerHTML = `
    <div>Subtotal: $${total.toFixed(2)}</div>
    <div>Tax (5%): $${tax.toFixed(2)}</div>
    <div>Shipping: $${shipping.toFixed(2)}</div>
    <strong>Total: $${grandTotal.toFixed(2)}</strong>
  `;
  cartBox.appendChild(summary);
}

// If you want to do some setup on DOM ready you can do this:
document.addEventListener('DOMContentLoaded', () => {
  // You can optionally auto-init here or do nothing
  // For example:
  // initCart(yourDataHere);
});
