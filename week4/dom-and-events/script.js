function attachToBody(node) {
  document.body.appendChild(node);
}

function appendTableHeader(tableElement, cols) {
  const tableHead = document.createElement('thead');
  const tableRow = document.createElement('tr');

  for (let i = 0; i < cols; i++) {
    const tableHeaderCell = document.createElement('th');

    tableHeaderCell.textContent = `Header ${i + 1}`;
    tableHeaderCell.style.border = '1px solid black';
    tableRow.appendChild(tableHeaderCell);
  }

  tableHead.appendChild(tableRow);
  tableElement.appendChild(tableHead);
}

function appendTableBody(tableElement, rows, cols) {
  const tableBody = document.createElement('tbody');
  tableBody.id = 'tableBody';

  for (let row = 0; row < rows; row++) {
    const tableRow = document.createElement('tr');

    for (let col = 0; col < cols; col++) {
      const tableCell = document.createElement('td');
      tableCell.style.border = '1px solid black';
      tableCell.style.boxSizing = 'border-box';

      tableCell.textContent = `${row + 1}, ${col + 1}`;
      tableRow.appendChild(tableCell);
    }

    tableBody.appendChild(tableRow);
  }

  tableElement.appendChild(tableBody);
}

function createTable(rows, cols) {
  const table = document.createElement('table');
  table.style.textAlign = 'center';
  table.style.border = '1px solid black';
  table.style.margin = '1em 0';

  appendTableHeader(table, cols);
  appendTableBody(table, rows - 1, cols);

  return table;
}

// uses innerHTML because textContent cant create escaped HTML characters
function insertDirectionalButtons(gridBody) {
  const upCell = gridBody.rows[0].cells[1];
  upCell.innerHTML = '<button><strong>&uarr;</strong></button>';
  upCell.id = 'up';

  const leftCell = gridBody.rows[1].cells[0];
  leftCell.innerHTML = '<button><strong>&larr;</strong></button>';
  leftCell.id = 'left';

  const downCell = gridBody.rows[1].cells[1];
  downCell.innerHTML = '<button><strong>&darr;</strong></button>';
  downCell.id = 'down';

  const rightCell = gridBody.rows[1].cells[2];
  rightCell.innerHTML = '<button><strong>&rarr;</strong></button>';
  rightCell.id = 'right';
}

function createDirectionalButtonDiv() {
  const directionalGrid = document.createElement('table');
  directionalGrid.style.textAlign = 'center';
  directionalGrid.style.margin = '1em 0';
  const directionalGridBody = document.createElement('tbody');

  for (let i = 0; i < 2; i++) {
    const row = document.createElement('tr');

    for (let j = 0; j < 3; j++) {
      const cell = document.createElement('td');
      row.appendChild(cell);
    }

    directionalGridBody.appendChild(row);
  }

  insertDirectionalButtons(directionalGridBody);
  directionalGrid.appendChild(directionalGridBody);

  return directionalGrid;
}

function createMarkButton() {
  const markButton = document.createElement('button');

  markButton.id = 'markButton';
  markButton.textContent = 'Mark Cell';

  return markButton;
}

function getSelectedCell() {
  return document.getElementById('selectedCell');
}

function getCellFromMap(row, col, gridMap) {
  return gridMap.rows[row].cells[col];
}

function selectCell(cell) {
  const selectedCell = cell;

  selectedCell.id = 'selectedCell';
  selectedCell.style.border = '4px solid black';
}

function resetCell(cell) {
  const cellToReset = cell;

  cellToReset.removeAttribute('id');
  cellToReset.style.border = '1px solid black';
}

function turnCellBackgroundYellow() {
  getSelectedCell().style.backgroundColor = 'yellow';
}

// Will only return false (returns undef) if it goes out of bounds
function cellExists(row, col, tableBody) {
  // Short circuits at undefined row to avoid throwing error when trying to access
  // undefined.cells
  return Boolean(tableBody.rows[row] && tableBody.rows[row].cells[col]);
}

function moveSelectedCell(row, col) {
  const tableBody = document.getElementById('tableBody');
  const currentCell = getSelectedCell();
  const [currRow, currCol] = currentCell.textContent.split(',')
    .map(ele => parseInt(ele - 1, 10));

  const newRowPos = currRow + row;
  const newColPos = currCol + col;

  // Exit function if out of bounds
  if (!cellExists(newRowPos, newColPos, tableBody)) {
    return;
  }

  const nextCell = getCellFromMap(newRowPos, newColPos, tableBody);
  resetCell(currentCell);
  selectCell(nextCell);
}

function initializeSelectedCell() {
  const initialCell = document.getElementById('tableBody').rows[0].cells[0];

  selectCell(initialCell);
}

function initializeEventListeners() {
  document.getElementById('markButton').addEventListener('click', turnCellBackgroundYellow);
  document.getElementById('left').addEventListener('click', () => moveSelectedCell(0, -1));
  document.getElementById('right').addEventListener('click', () => moveSelectedCell(0, 1));
  document.getElementById('up').addEventListener('click', () => moveSelectedCell(-1, 0));
  document.getElementById('down').addEventListener('click', () => moveSelectedCell(1, 0));
}

function buildPage() {
  const NUM_OF_ROWS = 4;
  const NUM_OF_COLS = 4;

  attachToBody(createTable(NUM_OF_ROWS, NUM_OF_COLS));
  attachToBody(createDirectionalButtonDiv());
  attachToBody(createMarkButton());

  initializeSelectedCell();
  initializeEventListeners();

  return document.getElementById('tableBody');
}

document.addEventListener('DOMContentLoaded', buildPage);
