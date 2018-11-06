'use strict'

const router = require('express').Router()

router.get('/', (req, res) => {
    query.getListPenipu((err, r) => {
        res.send(r)
    })
})


module.exports = router