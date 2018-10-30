 
/*
const oracle = require('../../lib/oracledb')
const oracledb = require('oracledb')
*/
var router = require('express').Router();
const insert = require('../../modul/insert_foto')
const ceks = require('../../modul/cek_channel')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
let multer = require('multer');
let upload = multer();
const verif = require('../../modul/verify')
router.post('/send', (req, res) => {
//   let formData = req.body;
//   console.log('form data', formData);
  res.sendStatus(200);
});

router.post('/', function(req, res, next) {
    res.status(200).send(req.query.user)
    insert.insert_foto('2121')
})


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

router.post('/kyc_fingerprint', verif,function(req, res, next) {
    
    console.log('ini '+req.channelId)
	
    if(req.channelId == req.body.channel_name){ 
    insert.insert_sidik(req.body,function(error,result){
        if(error){res.status(200).send(error)}
        else{res.status(200).send("00-Sukses")}
    }
    )
    }else{
        res.status(200).send("{ channel name: " +req.body.channel_name+ ", error_code: '99', Message : 'Unregistered Channel' }")
    }
   
})

router.get('/', function(req, res, next) {
    res.status(200).send(req.query.user)
})
/*
router.get('/lihat_data', function(req, res, next) {
    oracle(`select * from KYC_PHOTO`, [], { autoCommit: true }, function (err, result) {
            if (err) {
                res.status(200).send(err)
            } else {
                res.status(200).send(result.rows)
            }
        })

})
*/
router.post('/get_token', function(req, res) {
    
    var cek = ceks.cek_c(req.body.channel_name,function(error,result){
        if(error){res.status(200).send(error)}
        else{
            console.log(result)

            if(result.rows.length > 0){
            var token = jwt.sign({ id: req.body.channel_name }, 'Gantengs', {
                expiresIn: 120000 // expires in 24 hours
              })
        
              res.send(token)
         
       	    }else{
              res.status(200).send("{ channel name: " +req.body.channel_name+ ", error_code: 'ERR099', Message : 'Unregistered Channel' }")
            }
    }
    })

    

  })

module.exports = router;
