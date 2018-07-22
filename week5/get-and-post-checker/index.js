const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
  
const app = express();
const PORT = process.argv[2] || 8080;

const hbsConfig = {
  extname: 'hbs',
  defaultLayout: 'main',
};

app.engine('hbs', hbs(hbsConfig));

app.set('view engine', 'hbs');
app.set('port', PORT);

app.get('/', (req, res) => {
  const content = {};
  const isQueryEmpty = Object.keys(req.query).length === 0;

  if (isQueryEmpty) {
    content.title = 'WELCOME';
  } else {
    content.title = 'GET Request Received';
    content.sentData = Object.assign({}, req.query);
  }

  res.render('home', content);
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(app.get('port'), () => {
  console.log(`Server started on ${app.get('port')}. Press Ctrl-C to terminate...`);
});