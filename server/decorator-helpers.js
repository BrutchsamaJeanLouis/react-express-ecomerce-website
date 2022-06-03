const ensureAuthenticationAndStandard = (req, res, next) => {
  // id user session exists - Carry on
  if (req.session.user?.accountType === 'standard') {
    return next()
  }

  // else tell react to redirect to login
  res.status(302).json({ redirect: '/login', error: 'Login to complete operation' })
}

const ensureAuthenticationAny = (req, res, next) => {
  // id user session exists - Carry on
  if (req.session.user?.accountType) {
    return next()
  }

  // else tell react to redirect to login
  res.status(302).json({ redirect: '/login', error: 'Login to complete operation' })
}

const ensureAuthenticationAndAdmin = (req, res, next) => {
  // id user session exists && is admin - Carry on
  if (req.session.user?.accountType === 'admin') {
    return next()
  }

  // else tell react to redirect to login
  res.status(302).json({ redirect: '/login', error: 'Login to complete operation' })
}

const ensureAuthenticationAndModerator = (req, res, next) => {
  // id user session exists && is admin - Carry on
  if (req.session.user?.accountType === 'moderator') {
    return next()
  }

  // else tell react to redirect to login
  res.status(302).json({ redirect: '/login', error: 'Login to complete operation' })
}

module.exports = {
  ensureAuthenticationAndStandard,
  ensureAuthenticationAndAdmin,
  ensureAuthenticationAndModerator,
  ensureAuthenticationAny
}
