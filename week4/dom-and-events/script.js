function attachToBody(node) {
  document.body.appendChild(node);
}

function appendTableHeader(tableElement, cols) {
  const tableHead = document.createElement('thead');
  const tableRow = document.createElement('tr');

  for (let i = 0; i < cols; i++) {
    const tableHeaderCell = document.createElement('th');

    tableHeaderCell.textContent = `Header ${i + 1}`;
    tableRow.appendChild(tableHeaderCell);
  }

  tableHead.appendChild(tableRow);
  tableElement.appendChild(tableHead);
}

function appendTableBody(tableElement, rows, cols) {
  const tableBody = document.createElement('tbody');

  for (let row = 0; row < rows; row++) {
    const tableRow = document.createElement('tr');

    for (let col = 0; col < cols; col++) {
      const tableCell = document.createElement('td');

      tableCell.textContent = `${row + 1} ${col + 1}`;
      tableRow.appendChild(tableCell);
    }

    tableBody.appendChild(tableRow);
  }

  tableElement.appendChild(tableBody);
}

function createTable(rows, cols) {
  const table = document.createElement('table');

  appendTableHeader(table, cols);
  appendTableBody(table, rows - 1, cols);

  return table;
}

function buildPage() {
  const NUM_OF_ROWS = 4;
  const NUM_OF_COLS = 4;

  const table = createTable(NUM_OF_ROWS, NUM_OF_COLS);
  attachToBody(table);
}

document.addEventListener('DOMContentLoaded', buildPage);
