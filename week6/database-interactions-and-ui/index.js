const express = require('express');
const hbs = require('express-handlebars');

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

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
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
      const content = Object.assign({}, workout);

      res.status(200).render('edit', content);
    })
    .catch(() => res.status(404).render('404'));
});

app.get('/reset-table', (req, res) => {
  DBQuery.resetDB()
    .then(() => res.status(200).render('home', {}))
    .catch(() => res.status(500).render('500'));
});

app.post('/api/workouts', (req, res) => {
  DBQuery.addNewWorkout(req.body)
    .then(workout => res.status(200).json(workout))
    .catch(() => res.status(500).render('500'));
});

app.put('/api/workouts/:id', (req, res) => {
  DBQuery.updateWorkout(req.params.id, req.body)
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500));
});

app.delete('/api/workouts/:id', (req, res) => {
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
