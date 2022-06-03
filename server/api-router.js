var express = require('express');
var router = express.Router();
const indexRouter = require('./routes/index')
const mediaRouter = require('./routes/media')
const itemRouter = require('./routes/Item')

router.use('/', indexRouter)

module.exports = router;