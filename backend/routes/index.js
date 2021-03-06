var router = require('express').Router();

const query = require('../query/script_query')
const logger = require('../service/logger')


//router.use('/api', require('./api'));
router.use('/auth', require('./api/auth'))
router.use('/penipu', require('./api/penipu'))
router.use('/reference', require('./api/reference'))
router.use('/sms', require('./api/sms_tipu'))

router.get('/listAll', (req, res) => {
    query.getListPenipu((err, r) => {
        res.send(r)
    })
})

router.get('/referencePenipu', (req, res) => {
    query.getReference((err, r) => {
        res.send(r)
    })
})

router.post('/insert_detail', (req, res) => {
    query.insertDetail(req.body, (err, r) => {
        if (err) {
            res.status(200).send(err)
        } else {
            logger.info('sukses insert detail' + req.body.msisdn_target)
            res.status(200).send('sukses')
        }
    })
})

router.post('/update_reference', (req, res) => {
    query.update_reference(req.body, (err, r) => {
        if (err) {
            res.status(200).send(err)
        } else {
            console.log('sukses')
            res.status(200).send('sukses')
        }
    })
})

router.post('/get_detail', (req, res) => {
    query.getDetail(req.body.msisdn, (err, r) => {
        if (err) {
            res.status(200).send(err)
        } else {
            console.log('sukses')
            var hasil = r
            // res.status(200).send(r)
            query.getDetail2(req.body.msisdn, (ee, rr) => {
                if (ee) {
                    res.status(200).send(ee)
                } else {
                    hasil.akhir = rr
                    res.status(200).send({
                        r,
                        rr
                    })
                }
            })
        }
    })
})


/*
router.post('/kyc_photo',verif, function(req, res, next) {
    
    console.log('ini '+req.channelId)
	
    if(req.channelId == req.body.channel_name){ 
    insert.insert_foto(req.body,function(error,result){
        if(error){res.status(200).send(error)}
        else{res.status(200).send("00-Sukses")}
    }
    )
    }else{
        res.status(200).send("{ channel name: " +req.body.channel_name+ ", error_code: '99', Message : 'Unregistered Channel' }")
    }
})


*/

module.exports = router;