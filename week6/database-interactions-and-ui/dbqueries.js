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
      if (err) {
        reject(err);
      }

      try {
        let workouts = JSON.parse(JSON.stringify(result))
          .map(formatWorkout);

        resolve(workouts);
      } catch(e) {
        reject(e);
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
        if (err || !result.length) {
          reject(err);
        }

        try {
          resolve(JSON.parse(JSON.stringify(result[0])));
        } catch (e) {
          reject(e);
        }
      }
    );
  });
}

function updateWorkout(id, updatedWorkout) {
  const { name, reps, weight, date, lbs } = updatedWorkout;

  return new Promise((resolve, reject) => {
    mysql.pool.query(
      'UPDATE workouts ' +
      'SET name = ?, reps = ?, weight = ?, date = ?, lbs = ? ' +
      'WHERE id = ?',
      [name, reps, weight, date, lbs, id],
      (err) => {
        if (err) {
          reject(err);
        }

        resolve();
      }
    );
  });
}

function addNewWorkout(workout) {
  const { name, reps, weight, date, lbs } = workout;
  let workoutWithId = Object.assign({}, workout);

  return new Promise((resolve, reject) => {
    mysql.pool.query(
      'INSERT INTO workouts (name, reps, weight, date, lbs) ' +
      'VALUES (?, ?, ?, ?, ?)',
      [name, reps, weight, date, lbs],
      (err, result) => {
        if (err) {
          reject(err);
        }

        // return the id with the workout so the frontend can handle
        // DOM manipulation
        workoutWithId.id = result.insertId;

        // return date with the proper format per requirements
        workoutWithId.date = moment(workoutWithId.date, 'YYYY-MM-DD').format('MM-DD-YYYY');

        workoutWithId = parseUnits(workoutWithId);

        resolve(workoutWithId);
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
        if (err) {
          reject(err);
        }

        resolve();
      }
    );
  });
}

function resetDB() {
  return new Promise((resolve, reject) => {
    mysql.pool.query('DROP TABLE IF EXISTS workouts', (err) => {
      if (err) {
        reject(err);
      }

      const createString = 'CREATE TABLE workouts (' +
        'id INT PRIMARY KEY AUTO_INCREMENT,' +
        'name VARCHAR(255) NOT NULL,' +
        'reps INT,' +
        'weight INT,' +
        'date DATE,' +
        'lbs INT' +
        ')';

      mysql.pool.query(createString, (createStringErr) => {
        if (createStringErr) {
          reject(err);
        }

        resolve();
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
