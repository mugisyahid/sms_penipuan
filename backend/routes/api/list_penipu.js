'use strict'
var mysql = require('mysql');
const router = require('express').Router()
const data = require('../../query/script_query')

router.get('/get_list', function(req, res){
    

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "sms_penipuan"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM d_summary_penipu limit 0,1", function (err, result, fields) {
    if (err) {throw err;
    console.log(result);
    }else{res.send(result)}
  });
});

})




module.exports = router
