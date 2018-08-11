const express = require('express');
const hbs = require('express-handlebars');

const app = express();
const PORT = process.argv[2] || 8080;

const hbsConfig = {
  extname: 'hbs',
  defaultLayout: 'main',
  partialsDir: `${__dirname}/views/partials`,
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.engine('hbs', hbs(hbsConfig));

app.set('view engine', 'hbs');
app.set('port', PORT);

app.get('/', (req, res) => {
  const content = {};
  const isQueryEmpty = Object.keys(req.query).length === 0;

  if (isQueryEmpty) {
    content.title = 'Welcome, send a GET or POST to see the results';
  } else {
    content.title = 'GET Request Received';
    content.queryData = Object.assign({}, req.query);
  }

  res.render('home', content);
});

app.post('/', (req, res) => {
  const content = {};

  content.title = 'POST Request Received';
  content.queryData = Object.assign({}, req.query);
  content.bodyData = Object.assign({}, req.body);

  res.render('home', content);
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500');
});

app.listen(app.get('port'), () => {
  console.log(`Server started on ${app.get('port')}. Press Ctrl-C to terminate...`);
});
