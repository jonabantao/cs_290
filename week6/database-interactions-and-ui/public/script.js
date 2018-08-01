const formatDate = function parseDate(date) {
  const workoutDate = new Date(date);
  const formattedDate = `${workoutDate.getMonth() + 1}-${workoutDate.getDate()}-${workoutDate.getFullYear()}`;

  return formattedDate;
};

// Function to append new rows into table without refreshing
const appendToTable = function appendData(workout) {
  const tableRow = document.createElement('tr');
  const workoutUnits = workout.lbs === 0 ? 'Kilograms' : 'Pounds';
  const dataToAppend = [
    workout.name,
    workout.reps,
    workout.weight,
    formatDate(workout.date),
    workoutUnits,
  ];

  dataToAppend.forEach((workoutData) => {
    const tableCell = document.createElement('td');
    tableCell.textContent = workoutData;

    tableRow.appendChild(tableCell);
  });

  const tableCellButtons = document.createElement('td');

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  tableCellButtons.appendChild(deleteButton);

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  tableCellButtons.appendChild(editButton);

  tableRow.appendChild(tableCellButtons);

  document.getElementById('tableBody').appendChild(tableRow);
};

const constructJSONfromForm = function formatJSON() {
  function getValue(string) {
    return document.getElementById(string).value;
  }

  const body = {};

  body.name = getValue('name');
  body.reps = getValue('reps');
  body.weight = getValue('weight');
  body.date = getValue('date');
  body.lbs = document.getElementById('kilos').checked ? 0 : 1;

  return JSON.stringify(body);
};

const handleSubmit = function formSubmit() {
  const workoutData = constructJSONfromForm();

  return fetch('/api/workouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: workoutData,
  }).then(res => res.json())
    .then(appendToTable);
};

document.getElementById('logForm').addEventListener('submit', (e) => {
  e.preventDefault();
  handleSubmit();
});
