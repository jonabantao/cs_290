const mysql = require('./dbcon');

function fetchWorkouts() {
  return new Promise((resolve, reject) => {
    mysql.pool.query('SELECT * FROM workouts', (err, result) => {
      if (err) {
        reject(err);
      }

      resolve(JSON.stringify(result));
    });
  });
}

function testInsert() {
  mysql.pool.query(
    'INSERT INTO workouts (name, reps, weight, date, lbs)' +
    'VALUES (?, ?, ?, ?, ?)',
    ['test', 5, 120, '1943-1-2', 0],
    (err, res) => {
      console.log(res);
    }
  );
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
  testInsert,
  resetDB,
};
