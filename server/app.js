const createError = require('http-errors')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const session = require('express-session')
const MYSQLStore = require('express-mysql-session')(session)
const sessionStore = new MYSQLStore({
  connectionLimit: 10,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  database: process.env.DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  clearExpired: true,

  // how often to check for expired sessions
  checkExpirationInterval: 60000, // (60 seconds) value in milliseconds

  // time a session is valid for
  expiration: 10800000, // (3hrs) value in milliseconds
  createDatabaseTable: true
})
// request limit error status 429
const appLimiter = require('express-rate-limit').rateLimit({
  windowMs: 10000, // 10seconds
  max: 15,
  message: { error: 'Slow down! To many server request.' }
})
const authLimiter = require('express-rate-limit').rateLimit({
  windowMs: 7200000, // in 2hr
  max: process.env.NODE_ENV === 'dev' ? 100 : 7, //         // max 7 authentication attempts
  message: { error: 'You exceeded the amount of authentication attempts. Try again later.' }
})

const apiRouter = require('./api-router')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(cors()) // TODO PROD-TASK whitelist expected origins
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({ key: 'ecommoh', secret: 'ecommohHushKey', store: sessionStore, resave: false, saveUninitialized: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/logout', authLimiter)
app.use('/api/logout', authLimiter)
app.use('/api/login', authLimiter)
app.use('/api/register', authLimiter)
app.use('/api/register/confirm', authLimiter)
app.use(appLimiter)

// Not the main logout route only exist incase user use
// URL to logout instead of website button
// no need to make a route in react router this will be handled here
app.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})
// Registering routes to a uri
app.use('/api', apiRouter)
// passing all unknown urls into react client (parsed by react router)
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, './public', 'index.html')))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'dev' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
