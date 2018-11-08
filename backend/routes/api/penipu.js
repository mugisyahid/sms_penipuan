'use strict'

const router = require('express').Router()
const query = require('../../query/penipu')

router.get('/', (req, res) => {
    // query.getPenipu(req.query.f, req.query.t, (err, r) => {
    //     res.send(r)
    // })
    query.getAllPenipu((err, r) => {
        res.send(r)
    })
})

router.get('/count', (req, res) => {
    query.count((err, r) => {
        res.send(r)
    })
})


module.exports = router