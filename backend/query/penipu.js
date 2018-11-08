const mysql = require('mysql')
const kon = require('../service/dbset')

function getPenipu(f, t, callback) {
    kon.ekse(`SELECT * from d_summary_penipu order by jumlah_pelapor limit ${f}, ${t}`, callback)
}
function getAllPenipu(callback) {
    kon.ekse(`SELECT * from d_summary_penipu order by jumlah_pelapor`, callback)
}

function count(callback) {
    kon.ekse(`SELECT count(*) as jumlah from d_summary_penipu`, callback)
}


module.exports = {
    getPenipu,
    count,
    getAllPenipu
}