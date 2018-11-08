'use strict'

const router = require('express').Router()
const query = require('../../query/reference')
const logger = require('../../service/logger')

router.get('/', (req, res) => {
    query.getReference(req.query.msisdn, (err, r) => {
        res.send(r)
    })
})
router.post('/', (req, res) => {
    req.body.payload.forEach(element => {
        query.updateReference(element, (err, r) => {
            logger.info('update reference ' + element.msisdn)
        })
    })
    res.status(200).send('OKE MANTAP')
})



module.exports = router