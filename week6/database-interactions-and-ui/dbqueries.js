// Moment library for ease of date formatting
const moment = require('moment');

const mysql = require('./dbcon');

// HELPER FUNCTIONS TO MODIFY WORKOUT LOG FOR FRONTEND
function parseUnits(workout) {
  if (workout.lbs) {
    workout.unit = 'Pounds';
  } else {
    workout.unit = 'Kilograms';
  }

  delete workout.lbs;

  return workout;
}

function parseDate(workout) {
  const formattedDate = moment(workout.date).format('MM-DD-YYYY');

  workout.date = formattedDate;

  return workout;
}

function formatWorkout(workout) {
  let formattedWorkout = Object.assign({}, workout);

  formattedWorkout = parseUnits(formattedWorkout);
  formattedWorkout = parseDate(formattedWorkout);

  return formattedWorkout;
}



// DB QUERIES
function fetchWorkouts() {
  return new Promise((resolve, reject) => {
    mysql.pool.query('SELECT * FROM workouts', (err, result) => {
      if (err) return reject(err);

      try {
        let workouts = JSON.parse(JSON.stringify(result))
          .map(formatWorkout);

        return resolve(workouts);
      } catch(e) {
        return reject(e);
      }
    });
  });
}

function fetchWorkout(id) {
  return new Promise((resolve, reject) => {
    mysql.pool.query(
      'SELECT * FROM workouts WHERE id = ?',
      [id],
      (err, result) => {
        if (err || !result.length) return reject(err);

        try {
          let workout = JSON.parse(JSON.stringify(result[0]));

          // Format input date specifically for input value in edit page
          workout.inputDate = moment(workout.date).format('YYYY-MM-DD');
          workout = parseDate(workout);

          return resolve(workout);
        } catch (e) {
          return reject(e);
        }
      }
    );
  });
}

function updateWorkout(id, updatedWorkout) {
  const { name, reps, weight, date, lbs } = updatedWorkout;

  return new Promise((resolve, reject) => {
    if (!moment(date).isValid() || !name.length) return reject();

    mysql.pool.query(
      'UPDATE workouts ' +
      'SET name = ?, reps = ?, weight = ?, date = ?, lbs = ? ' +
      'WHERE id = ?',
      [name, reps, weight, date, lbs, id],
      (err) => {
        if (err) return reject(err);
        

        return resolve();
      }
    );
  });
}

function addNewWorkout(workout) {
  const { name, reps, weight, date, lbs } = workout;
  let workoutWithId = Object.assign({}, workout);

  return new Promise((resolve, reject) => {
    if (!moment(date).isValid() || !name.length) return reject();

    mysql.pool.query(
      'INSERT INTO workouts (name, reps, weight, date, lbs) ' +
      'VALUES (?, ?, ?, ?, ?)',
      [name, reps, weight, date, lbs],
      (err, result) => {
        if (err) return reject(err);

        // return the id with the workout so the frontend can handle
        // DOM manipulation
        workoutWithId.id = result.insertId;

        // return date with the proper format per requirements
        workoutWithId.date = moment(workoutWithId.date, 'YYYY-MM-DD').format('MM-DD-YYYY');

        workoutWithId = parseUnits(workoutWithId);

        return resolve(workoutWithId);
      }
    );
  });
}

function removeWorkout(id) {
  return new Promise((resolve, reject) => {
    mysql.pool.query(
      'DELETE FROM workouts ' +
      'WHERE id = ?',
      [id],
      (err) => {
        if (err) return reject(err);

        return resolve();
      }
    );
  });
}

function resetDB() {
  return new Promise((resolve, reject) => {
    mysql.pool.query('DROP TABLE IF EXISTS workouts', (err) => {
      if (err) return reject(err);

      const createString = 'CREATE TABLE workouts (' +
        'id INT PRIMARY KEY AUTO_INCREMENT,' +
        'name VARCHAR(255) NOT NULL,' +
        'reps INT,' +
        'weight INT,' +
        'date DATE,' +
        'lbs INT' +
        ')';

      mysql.pool.query(createString, (createStringErr) => {
        if (createStringErr) return reject(err);

        return resolve();
      });
    });
  });
}

module.exports = {
  fetchWorkouts,
  fetchWorkout,
  updateWorkout,
  addNewWorkout,
  removeWorkout,
  resetDB,
};
