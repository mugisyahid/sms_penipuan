var mysql = require('mysql')
const conf = require('../config/config_all')
const logger = require('../service/logger')


function ekse(query, callback) {
    let connection = mysql.createConnection(conf.mysql)
    connection.connect()
    connection.query(query, function (err, result) {
        if (err) throw callback(err, null)
        connection.end()
        callback(null, result)
    })
}

function ekse2(query, callback) {
    let connection = mysql.createConnection(conf.mysql2)
    connection.connect()
    connection.query(query, function (err, result) {
        if (err) throw callback(err, null)
        connection.end()
        callback(null, result)
    })
}

module.exports = {
    ekse,
    ekse2
}