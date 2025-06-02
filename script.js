function updateCart() {
  cartBox.innerHTML = '<h3>Cart</h3>';
  let total = 0;

  cart.forEach((item, idx) => {
    const itemDiv = document.createElement('div');

    const descSpan = document.createElement('span');
    descSpan.innerText = item.description.slice(0, 20) + '...';

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.value = item.quantity;
    qtyInput.min = 1;
    qtyInput.style.width = '40px';
    qtyInput.onchange = () => updateQuantity(idx, qtyInput.value);

    const priceSpan = document.createElement('span');
    const price = item.price * item.quantity;
    total += price;
    priceSpan.innerText = `$${price.toFixed(2)}`;
    priceSpan.style.float = 'right';

    const removeBtn = document.createElement('button');
    removeBtn.innerText = 'Remove';
    removeBtn.onclick = () => removeFromCart(idx);

    itemDiv.appendChild(descSpan);
    itemDiv.appendChild(qtyInput);
    itemDiv.appendChild(priceSpan);
    itemDiv.appendChild(removeBtn);

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
