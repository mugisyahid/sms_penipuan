var router = require('express').Router();

//router.use('/api', require('./api'));
router.use('/auth', require('./api/auth'));

module.exports = router;
