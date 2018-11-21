'use strict'

const router = require('express').Router()
const query = require('../../query/penipu')

router.get('/', (req, res) => {
    // query.getPenipu(req.query.f, req.query.t, (err, r) => {
    //     res.send(r)
    // })
    query.getAllPenipu((err, r) => {
        // res.status(500).send(r)

        // res.write('Hello\n');
        setInterval(function () {

            res.send(r)

            // res.end(' World\n');
        }, 5000);
    })
})

router.get('/count', (req, res) => {
    query.count((err, r) => {
        res.send(r)
    })
})


module.exports = router