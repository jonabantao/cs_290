const express = require('express');
const hbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || process.argv[2] || 8000;

app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  partialsDir: `${__dirname}/views/partials`,
}));

app.set('view engine', 'hbs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.status(200).render('home');
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}. Press Ctrl-C to terminate`);
});
