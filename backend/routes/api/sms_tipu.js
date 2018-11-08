'use strict'

const router = require('express').Router()
const query = require('../../query/sms_tipu')
const query2 = require('../../query/script_query')

router.get('/', (req, res) => {
    query.getDetailSMS(req.query.msisdn, (err, r) => {
        res.send(r)
    })
})

router.get('/v2', (req, res) => {
    query2.getDetail(req.query.msisdn, (err, r) => {
        query2.getDetail2(req.query.msisdn, (errr, rr) => {
            r.concat(rr)
            res.send(r)
        })
    })
})



module.exports = router