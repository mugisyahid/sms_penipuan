const config = require('../config/config_all')
const oracle = require('../lib/oracledb')
const oracledb = require('oracledb')

function cek_c (crot, callback) {
    let query = `select * from KYC_CHANNEL where CHANNEL_NAME = '${crot}'`
    console.log(query)
    oracle(query, [], { autoCommit: true }, function (err, result) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, result) // array result
            }
        })
}



module.exports = {cek_c}