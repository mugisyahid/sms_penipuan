'use strict'

const router = require('express').Router()
const query = require('../../query/reference')

router.get('/', (req, res) => {
    query.getReference(req.query.msisdn, (err, r) => {
        res.send(r)
    })
})



module.exports = router