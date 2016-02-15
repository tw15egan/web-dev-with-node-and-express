var express = require('express');

var app = express();

// Set up handlebars view engine
var handlebars = require('express-handlebars').create( { defaultLayout: 'main' });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

// Fortune COOKIE
var fortunes = [
  'Conquer your fears or they will conquer you',
  'Rivers need springs',
  'Do not fear what you do not know',
  'You will have a pleasant surprise',
  'Whenever possible, keep it simple'
];

// Default route
app.get('/', function(req, res) {
  res.render('home');
});

app.get('/about', function(req, res) {
  var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  res.render('about', { fortune: randomFortune });
})

// Custom 404 Page
app.use(function(req, res, next) {
  res.status(404);
  res.render('404');
});

// Custom 500 Page
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function() {
  console.log(' Express started on http://localhost:' + app.get('port') + '; Press Ctrl-C to terminate');
})
