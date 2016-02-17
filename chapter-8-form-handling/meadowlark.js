var express = require('express')
var fortune = require('./lib/fortune.js')

var app = express()

// Set up handlebars view engine
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {}
      this._sections[name] = options.fn(this)
      return null
    }
  }
})

app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

app.set('port', process.env.PORT || 3000)

app.use(express.static(__dirname + '/public'))

// Testing route
app.use(function (req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1'
  next()
})

function getWeatherData () {
  return {
    locations: [
      {
        name: 'Portland',
        forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
        weather: 'Overcast',
        temp: '54.1 F (12.3 C)'
      }
    ]
  }
}

app.use(function (req, res, next) {
  if (!res.locals.partials) {
    res.locals.partials = {}
  }

  res.locals.partials.weatherContext = getWeatherData()

  next()
})

// Default routes
app.get('/', function (req, res) {
  res.render('home')
})

app.get('/about', function (req, res) {
  res.render('about', {
    fortune: fortune.getFortune(),
    pageTestScript: 'qa/tests-about.js'
  })
})

app.get('/tours/hood-river', function (req, res) {
  res.render('tours/hood-river')
})

app.get('/tours/request-group-rate', function (req, res) {
  res.render('tours/request-group-rate')
})

app.get('/jquery-test', function (req, res) {
  res.render('jquery-test')
})

app.get('/nursery-rhyme', function (req, res) {
  res.render('nursery-rhyme')
})

app.get('/data/nursery-rhyme', function (req, res) {
  res.json({
    animal: 'squirrel',
    bodyPart: 'tail',
    adjective: 'bushy',
    noun: 'hell'
  })
})
// Custom 404 Page
app.use(function (req, res) {
  res.status(404)
  res.render('404')
})

// Custom 500 Page
app.use(function (err, req, res) {
  console.error(err.stack)
  res.status(500)
  res.render('500')
})

app.listen(app.get('port'), function () {
  console.log(' Express started on http://localhost:' + app.get('port') + '; Press Ctrl-C to terminate')
})
