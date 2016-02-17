var express = require('express')
var fortune = require('./lib/fortune.js')

var app = express()

// Set up handlebars view engine
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' })

app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

app.set('port', process.env.PORT || 3000)

if (app.thing == null) {

}

app.use(express.static(__dirname + '/public'))

// Testing route
app.use(function (req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1'
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
