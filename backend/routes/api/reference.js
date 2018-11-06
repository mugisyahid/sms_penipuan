'use strict'

const router = require('express').Router()

router.get('/', (req, res) => {
    query.getReference((err, r) => {
        res.send(r)
    })
})



module.exports = router