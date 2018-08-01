const getValue = function getValueFnc(strName) {
  return document.getElementById(strName).value;
};

const constructJSONfromForm = function constructJSONfromFormFnc() {
  const logToUpdate = {
    name: getValue('name'),
    reps: getValue('reps'),
    weight: getValue('weight'),
    date: getValue('date'),
    lbs: document.getElementById('kilos').checked ? 0 : 1,
  };

  return JSON.stringify(logToUpdate);
};

const navigateToHomePage = function navigateToHomePageFnc() {
  window.location = '/';
};

const handleSubmit = function handleSubmitFnc() {
  const id = document.getElementById('logId').value;
  const workoutData = constructJSONfromForm();

  return fetch(`/api/workouts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: workoutData,
  }).then(navigateToHomePage)
    .catch(console.error);
};

const attachFormListener = function attachFormListenerFnc() {
  const logEditForm = document.getElementById('logEdit');

  if (logEditForm) {
    logEditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSubmit();
    });
  }
};

document.addEventListener('DOMContentLoaded', attachFormListener);