var express = require('express');
var router = express.Router();
const indexRouter = require('./routes/index')
const itemRouter = require('./routes/Item')

router.use('/', indexRouter)
router.use('/item', itemRouter)

module.exports = router
