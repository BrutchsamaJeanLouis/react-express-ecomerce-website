const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true })
const db = require('../../models')
const registerPostSchema = require('../validation-schema/api-register-post')
const { ensureAuthenticationAny } = require('../decorator-helpers')

/* GET home page. */
router.get('/credentials', async function (req, res, next) {
  if (!req.session.user) return res.json(null)

  const user = await db.User.findOne({ where: { id: req.session?.user?.id } })
  if (!user) return res.json(null)

  return res.json({ id: user.id, email: user.email, accountType: user.accountType })
})

router.post('/register', async (req, res) => {
  /** ---------------------------------------------------------------
   * validate the data sent by client against an expected json schema
   * --------------------------------------------------------------- */
  const validate = ajv.compile(registerPostSchema)
  const valid = validate(req.body)
  if (!valid) {
    console.log(validate.errors)
    return res.status(400).json({ error: validate.errors })
  }

  const { email, password, username, firstName, lastName } = req.body

  /** ---------------------------------------------------------------
   *    Check if Email or Username is not already existing
   * --------------------------------------------------------------- */

  const matchedEmail = await db.User.findOne({
    where: { email: email }
  })

  const matchedUsername = await db.User.findOne({
    where: { username: username }
  })

  if (matchedEmail) return res.status(500).send({ error: `email "${email}" already exist` })
  if (matchedUsername) return res.status(500).send({ error: `user "${username}" already exist` })

  /** ---------------------------------------------------------------
   *    Create hash password and save user
   * --------------------------------------------------------------- */

  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(password, salt)
  await db.User.create({
    username: username,
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: hashedPassword,
    verified: true // Default to true for now
  })
    .then((userFetchFromDB) => {
      // TODO
      // creating email token/url
      // Send verification email

      return res.status(302).json({ redirect: '/login' })
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).json({ error: error })
    })
})

// TODO schema validation
router.post('/login', async (req, res) => {
  const { email, password, username } = req.body
  const { attemptedUrl } = req.body
  try {
    const isUserLoggedIn = req?.session?.user ? true : false
    if (isUserLoggedIn) {
      return res.status(302).json({
        redirect: '/',
        loginStatus: isUserLoggedIn,
        sessionUser: req.session.user || null,
        successLoginRedirect: true
      })
    }

    const foundUser = await db.User.findOne({ where: { email: email } }).catch((err) => {
      return res.status(500).json({ error: err })
    })

    if (!foundUser) {
      console.log('Email not Found')
      return res.status(500).json({ error: 'Invalid email or password' })
    }

    const dBHashedPassword = foundUser.password
    bcrypt.compare(password, dBHashedPassword, (err, result) => {
      if (result === true) {
        // after a success password match check if the user is verified if not redirect to confirmation page
        if (foundUser.verified === false) {
          return res.status(302).json({ redirect: '/register-confirm', error: 'Account not verified' })
        }
        req.session.user = { id: foundUser.id, email: foundUser.email, accountType: foundUser.accountType }
        // Success
        // attemptedURL is set when react router locked route is triggered
        // lastBrowserPath is set On every axios request in interceptor (/client/App.jsx)
        res.status(302).json({ redirect: attemptedUrl || req.headers.lastbrowserpath || '/', successLoginRedirect: true })
      } else { // comparision failed
        res.status(500).send({ error: err || 'Invalid email or password' })
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error })
  }
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

module.exports = router
