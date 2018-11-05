var router = require('express').Router();

const query = require('../query/script_query')


//router.use('/api', require('./api'));
router.use('/auth', require('./api/auth'));
router.use('/api', require('./api/list_penipu'));

router.get('/ganteng', (req, res) => {
    query.getListPenipu((err, r) => {
        res.send(r)
    })
})

module.exports = router;
