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
  const workoutDate = new Date(workout.date);
  const formattedDate = `${workoutDate.getMonth() + 1}-${workoutDate.getDate()}-${workoutDate.getFullYear()}`;

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

function addNewWorkout(workout) {
  const { name, reps, weight, date, lbs } = workout;
  const workoutWithId = Object.assign({}, workout);

  return new Promise((resolve, reject) => {
    mysql.pool.query(
      'INSERT INTO workouts (name, reps, weight, date, lbs)' +
      'VALUES (?, ?, ?, ?, ?)',
      [name, reps, weight, date, lbs],
      (err, result) => {
        if (err) {
          reject(err);
        }

        // return the id with the workout so the frontend can handle
        // DOM manipulation
        workoutWithId.id = result.insertId;

        resolve(workoutWithId);
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
  addNewWorkout,
  resetDB,
};
