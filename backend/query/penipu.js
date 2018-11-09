const mysql = require('mysql')
const kon = require('../service/dbset')

function getPenipu(f, t, callback) {
    kon.ekse(`SELECT * from d_summary_penipu order by jumlah_pelapor limit ${f}, ${t}`, callback)
}
function getAllPenipu(callback) {
    kon.ekse(`select a.*,b.status from d_summary_penipu a LEFT JOIN reference_penipu b on a.msisdn_penipu = b.msisdn`, callback)
}

function count(callback) {
    kon.ekse(`SELECT count(*) as jumlah from d_summary_penipu`, callback)
}


module.exports = {
    getPenipu,
    count,
    getAllPenipu
}