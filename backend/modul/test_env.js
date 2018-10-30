const config = require('../config/config_all')
const oracle = require('../lib/oracledb')
const oracledb = require('oracledb')

function cek_channel (callback) {
    let query = `select * from KYC_CHANNEL`
    console.log(query)
    oracle(query, [], { autoCommit: true }, function (err, result) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, result) // array result
            }
        })
}

function cek_foto (callback) {
    let query = `select * from KYC_PHOTO`
    console.log(query)
    oracle(query, [], { autoCommit: true }, function (err, result) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, result) // array result
            }
        })
}

function cek_sidik (callback) {
    let query = `select * from KYC_FINGERPRINT`
    console.log(query)
    oracle(query, [], { autoCommit: true }, function (err, result) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, result) // array result
            }
        })
}


module.exports = {cek_channel,cek_foto,cek_sidik}