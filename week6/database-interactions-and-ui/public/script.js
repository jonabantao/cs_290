const formatDate = function formatDateFnc(date) {
  const workoutDate = new Date(date);
  const formattedDate = `${workoutDate.getMonth() + 1}-${workoutDate.getDate()}-${workoutDate.getFullYear()}`;
  
  return formattedDate;
};

const deleteLog = function deleteLogFnc(buttonNode) {
  const tableRow = buttonNode.parentNode.parentNode;
  const logId = tableRow.dataset.id;

  return fetch(`/api/workouts/${logId}`, { method: 'DELETE' })
    .then(res => {
      if (res.status === 200) {
        tableRow.remove();
      }
    })
    .catch(console.error);
};

const attachDeleteListeners = function attachDeleteListenersFnc() {
  const deleteButtons = document.getElementsByClassName('delete-workout');

  for (let deleteButton of deleteButtons) {
    deleteButton.addEventListener('click', () => deleteLog(deleteButton));
  }
};

const navigateToEditPage = function navigateToEditPageFnc(id) {
  window.location = `/edit/${id}`;
};

const attachEditListeners = function attachEditListenersFnc() {
  const editButtons = document.getElementsByClassName('edit-workout');

  for (let editButton of editButtons) {
    const workoutId = editButton.parentNode.parentNode.dataset.id;

    editButton.addEventListener('click', () => navigateToEditPage(workoutId));
  }
};

// Function to append new rows into table without refreshing
const appendToTable = function appendToTableFnc(workout) {
  const tableRow = document.createElement('tr');
  tableRow.dataset.id = workout.id;

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
  deleteButton.addEventListener('click', () => deleteLog(deleteButton));
  tableCellButtons.appendChild(deleteButton);

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => navigateToEditPage(workout.id));
  tableCellButtons.appendChild(editButton);

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

const handleSubmit = function handleSubmitFnc() {
  const workoutData = constructJSONfromForm();

  return fetch('/api/workouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: workoutData,
  });
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


document.addEventListener('DOMContentLoaded', () => {
  attachDeleteListeners();
  attachEditListeners();
  attachLogFormListener();
});

