'use strict'

const router = require('express').Router()
const query = require('../../query/sms_tipu')

router.get('/', (req, res) => {
    query.getDetailSMS(req.query.msisdn, (err, r) => {
        res.send(r)
    })
})



module.exports = router