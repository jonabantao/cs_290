const express = require('express');
const mysql = require('mysql');

const PORT = process.argv[2] || 8001;
const pool = mysql.createPool({
  // info added later
});

const app = express();


app.get('/reset-table', (req, res, next)) {
  const context = {};

  pool.query('DROP TABLE IF EXISTS workouts', (err => {
    const createString = 'CREATE TABLE workouts (' +
      'id INT PRIMARY KEY AUTO_INCREMENT,' +
      'name VARCHAR(255) NOT NULL,' +
      'reps INT,' +
      'weight INT,' +
      'date DATE,' +
      'lbs BOOLEAN' +
      ')';

    pool.query(createString, (err) => {
      context.results = 'Table Reset';
      res.render('home', content);
    })
  }));
}

app.listen(PORT, () => console.log(`Listening on ${PORT}. Press Ctrl-C to terminate`));