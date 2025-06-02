console.log('main.js loaded');
import { buildTable } from './table.js';
import { initCart } from './cart.js';
import { initSearch } from './search.js';
import { initFilters } from './filter.js';

document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      if (!data.length) return;

      const excludedCols = ['cost', 'supplier', 'department', 'date', 'markup', 'UoM'].map(c => c.toLowerCase());
      const table = document.getElementById('data-table');

      // Build table and get headers used
      const headers = buildTable(data, table, excludedCols);

      // Initialize cart
      initCart(data);

      // Initialize search UI
      initSearch(table);

      // Initialize filters UI
      initFilters(data, table);
    })
    .catch(error => {
      console.error('Error loading JSON:', error);
    });
});
