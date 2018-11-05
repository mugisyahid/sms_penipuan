var router = require('express').Router();

const query = require('../query/script_query')


//router.use('/api', require('./api'));
router.use('/auth', require('./api/auth'));
//router.use('/api', require('./api/list_penipu'));

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
    query.insertDetail(req.body,(err, r) => {
        if(err){res.status(200).send(err)}
        else{
            console.log('sukses')
            res.status(200).send('sukses')
        }
    })
})

router.post('/update_reference', (req, res) => {
    query.update_reference(req.body,(err, r) => {
        if(err){res.status(200).send(err)}
        else{
            console.log('sukses')
            res.status(200).send('sukses')
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
