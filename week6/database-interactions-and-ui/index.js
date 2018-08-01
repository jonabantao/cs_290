const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');

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

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res, next) => {
  DBQuery.fetchWorkouts()
    .then((exercises) => {
      const content = {};

      content.exerciseLog = exercises;

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
  DBQuery.addNewWorkout(req.body)
    .then(workout => res.status(200).json(workout))
    .catch(() => res.status(500).render('500'));
});

app.delete('/api/workouts/:id', (req, res, next) => {
  DBQuery.removeWorkout(req.params.id)
    .then(() => res.sendStatus(200))
    .catch(() => res.status(500).render('500'));
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}. Press Ctrl-C to terminate`);
});
