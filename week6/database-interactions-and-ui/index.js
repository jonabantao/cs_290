const express = require('express');
const hbs = require('express-handlebars');

const mysql = require('./dbcon');

const app = express();
const PORT = process.argv[2] || 8001;

app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  partialsDir: `${__dirname}/views/partials`,
}));

app.set('view engine', 'hbs');

app.get('/reset-table', (req, res, next) => {
  const context = {};

  mysql.pool.query('DROP TABLE IF EXISTS workouts', (err) => {
    const createString = 'CREATE TABLE workouts (' +
      'id INT PRIMARY KEY AUTO_INCREMENT,' +
      'name VARCHAR(255) NOT NULL,' +
      'reps INT,' +
      'weight INT,' +
      'date DATE,' +
      'lbs BOOLEAN' +
      ')';

    mysql.pool.query(createString, (err) => {
      context.results = 'Table Reset';
      res.render('home', content);
    });
  });
});


app.listen(PORT, () => console.log(`Listening on ${PORT}. Press Ctrl-C to terminate`));
