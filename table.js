export function buildTable(data, table, excludedCols) {
  // Clear existing table
  table.innerHTML = '';

  // Determine headers
  const headers = Object.keys(data[0]).filter(h => !excludedCols.includes(h.toLowerCase()));

  // Create header row
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

  // Create rows
  data.forEach((row, index) => {
    const tr = document.createElement('tr');
    tr.id = `row-${index}`;

    headers.forEach(header => {
      const td = document.createElement('td');
      td.innerText = row[header];
      tr.appendChild(td);
    });

    const cartTd = document.createElement('td');
    // Cart button is added by cart.js with event listeners attached there
    cartTd.classList.add('cart-cell');
    tr.appendChild(cartTd);

    table.appendChild(tr);
  });

  return headers;
}
