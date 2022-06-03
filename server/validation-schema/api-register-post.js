module.exports = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    username: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    }
  },
  additionalProperties: false,
  required: ['firstName', 'lastName', 'email', 'password', 'username']
}

// module.exports = { schema }
