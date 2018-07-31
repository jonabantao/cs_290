const express = require('express');
const hbs = require('express-handlebars');

const mysql = require('./dbcon');
const DBQuery = require('./dbqueries');

const app = express();
const PORT = process.argv[2] || 8001;

app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  partialsDir: `${__dirname}/views/partials`,
}));

app.set('view engine', 'hbs');

app.get('/', (req, res, next) => {
  DBQuery.fetchWorkouts()
    .then((exercises) => {
      const content = {};

      if (exercises.length) {
        content.exerciseLog = exercises;
      }
      console.log(exercises)

      res.status(200).render('home', content);
    })
    .catch(() => res.status(500).render('500'));
});

app.get('/reset-table', (req, res, next) => {
  DBQuery.resetDB()
    .then(() => {
      const content = {};
      content.info = 'Table Reset';

      res.status(200).render('home', content);
    })
    .catch(() => res.status(500).render('500'));
});

app.post('/api/workouts', (req, res, next) => {
  res.render('home');
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}. Press Ctrl-C to terminate`);
});
