export function initFilters(data, table) {
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
}
