var mysql = require('mysql');
const conf = require('../config/config_all')

var con = mysql.createConnection({
    host: conf.mysql.host,
    user: conf.mysql.user,
    database: conf.mysql.database
});

var con2 = mysql.createConnection({
    host: conf.mysql2.host,
    user: conf.mysql2.user,
    database: conf.mysql2.database
});


function ekse(query, callback) {
    console.log(query)
    con.connect(function (err) {
        if (err) throw err;
        con.query(query, function (err, result, fields) {
            console.log(err, result, fields)
            con.end()
            if (err) {
                callback(err, null)
            } else { callback(null, result)  }
        });
    });
}

function ekse2(query, callback) {
    console.log(query)
    con2.connect(function (err) {
        if (err) throw err;
        con2.query(query, function (err, result, fields) {
            console.log(err, result, fields)
            con2.end()
            if (err) {
                callback(err, null)
            } else { callback(null, result);  }
        });
    });
}

module.exports = {ekse, ekse2}