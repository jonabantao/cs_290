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
  helpers: {
    isSelected: function isSelectedFnc(workoutVal, value) {
      if (workoutVal === value) {
        return 'checked';
      }

      return '';
    }
  },
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


app.get('/edit/:id', (req, res) => {
  DBQuery.fetchWorkout(req.params.id)
    .then(workout => {
      let formattedWorkout = Object.assign({}, workout);

      // Lazily format date for prefilled form - will break for non-4-digit years
      formattedWorkout.date = formattedWorkout.date.substring(0, 10);

      const content = formattedWorkout;

      res.status(200).render('edit', content);
    })
    .catch(() => res.status(404).render('404'));
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

app.use((req, res) => {
  res.status(404).render('404');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500');
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}. Press Ctrl-C to terminate`);
});
