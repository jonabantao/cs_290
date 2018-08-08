const deleteLog = function deleteLogFnc(deleteButton) {
  const tableRow = deleteButton.parentNode.parentNode;
  const logId = tableRow.dataset.id;

  return fetch(`/api/workouts/${logId}`, { method: 'DELETE' })
    .then(res => {
      if (res.status === 200) {
        tableRow.remove();
      }
    })
    .catch(console.error);
};

// Function to append new rows into table without refreshing
const appendToTable = function appendToTableFnc(workout) {
  const tableRow = document.createElement('tr');
  tableRow.dataset.id = workout.id;

  const dataToAppend = [
    workout.name,
    workout.reps,
    workout.weight,
    workout.date,
    workout.unit,
  ];

  dataToAppend.forEach((workoutData) => {
    const tableCell = document.createElement('td');
    tableCell.textContent = workoutData;

    tableRow.appendChild(tableCell);
  });

  const tableCellButtons = document.createElement('td');

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('button', 'is-danger', 'is-small', 'delete-workout');
  deleteButton.textContent = 'Delete';
  tableCellButtons.appendChild(deleteButton);

  // https://stackoverflow.com/questions/8562843/how-to-append-a-space-after-an-element
  // This is needed because without anything between the text nodes,
  // new nodes created in JavaScript will not have any spacing
  // between them
  tableCellButtons.appendChild(document.createTextNode(' '));

  const editAnchor = document.createElement('a');
  editAnchor.href = `/edit/${workout.id}`;

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.classList.add('button', 'is-warning', 'is-small');

  editAnchor.appendChild(editButton);
  tableCellButtons.appendChild(editAnchor);

  tableRow.appendChild(tableCellButtons);

  document.getElementById('tableBody').appendChild(tableRow);
};

const constructJSONfromForm = function constructJSONfromFormFnc() {
  function getValue(string) {
    return document.getElementById(string).value;
  }

  const body = {
    name: getValue('name'),
    reps: getValue('reps'),
    weight: getValue('weight'),
    date: getValue('date'),
    lbs: document.getElementById('kilos').checked ? 0 : 1,
  };

  return JSON.stringify(body);
};

const clearForm = function clearFormFnc() {
  document.getElementById('logForm').reset();
};

const handleSubmit = function handleSubmitFnc() {
  const workoutData = constructJSONfromForm();

  return fetch('/api/workouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: workoutData,
  })
  .then(res => res.json())
  .then(appendToTable)
  .then(clearForm)
  .catch(console.error);
};

const attachLogFormListener = function attachLogFormListenerFnc() {
  const logForm = document.getElementById('logForm');

  if (logForm) {
    logForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSubmit();
    });
  }
};

const handleClickListeners = function handleClickListenersFnc(e) {
  const nodeTarget = e.target;

  if (nodeTarget.classList.contains('delete-workout')) {
    return deleteLog(nodeTarget);
  }

  return;
};


document.addEventListener('DOMContentLoaded', () => {
  attachLogFormListener();
  document.getElementById('tableBody').addEventListener('click', (e) => {
    handleClickListeners(e);
  });
});
