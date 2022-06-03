const path = require('path')
if (process.env.NODE_ENV) {
  require('dotenv').config({
    path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`)
  })
  console.log(`Running server on port ${process.env.SERVER_PORT} with environment >> ${process.env.NODE_ENV}`)
} else {
  console.error('No NODE_ENV provided')
  process.exit()
}

// sequelize config
module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false
}

// module.exports = { config }
