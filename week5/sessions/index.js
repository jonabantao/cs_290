const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const session = require('express-session');

const app = express();
const PORT = process.argv[2] || 8080;

const HBS_CONFIG = {
  extname: 'hbs',
  defaultLayout: 'main',
  partialsDir: `${__dirname}/views/partials`,
};

const SESSION_CONFIG = {
  secret: 'hunter2',
  saveUninitialized: false,
  resave: true,
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session(SESSION_CONFIG));

app.engine('hbs', hbs(HBS_CONFIG));

app.set('view engine', 'hbs');

app.get('/count', (req, res) => {
  const context = {};

  // Checks the session of the request and see if it has anything stored
  context.count = req.session.count || 0;

  // Sends back something to store in user's session
  req.session.count = context.count + 1;

  // counts are saved by browser, not tab
  res.render('count', context);
});

app.get('/', (req, res) => {
  const context = {};

  if (!req.session.name) {
    return res.render('todo', context);
  }

  context.name = req.session.name;
  context.toDoCount = req.session.toDo.length || 0;
  context.toDo = req.session.toDo || [];

  res.render('todo-list', context);
});

app.post('/', (req, res) => {
  const context = {};

  if (req.body['New List']) {
    
    req.session.name = req.body.name;
    req.session.toDo = [];
    req.session.curId = 0;
  }

  if (!req.session.name) {
    res.render('todo', context);
    return;
  }

  if (req.body['Add Item']) {
    req.session.toDo.push({
      name: req.body.name,
      id: req.session.curId,
    });

    req.session.curId++;
  }

  if(req.body['Done']) {
    console.log(req.body.id);
    req.session.toDo = req.session.toDo.filter(e => e.id != req.body.id);
  }

  context.name = req.session.name;
  context.toDoCount = req.session.toDo.length;
  context.toDo = req.session.toDo;

  res.render('todo-list', context);
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500');
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}. Press Ctrl-C to terminate...`);
});