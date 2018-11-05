var mysql = require('mysql');
const conf = require('../config/config_all')
var con = mysql.createConnection({
    host: conf.mysql.host,
    user: conf.mysql.user,
    database: conf.mysql.database
});


function ekse(query, callback) {
    console.log(query)
    con.connect(function (err) {
        if (err) throw err;
        con.query(query, function (err, result, fields) {
            console.log(err, result, fields)
            if (err) {
                callback(err, null)
            } else { callback(null, result) }
        });
    });
}

module.exports = ekse