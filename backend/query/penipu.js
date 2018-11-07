const mysql = require('mysql')
const kon = require('../service/dbset')

function getPenipu(f, t, callback) {
    kon.ekse(`SELECT * from d_summary_penipu order by jumlah_pelapor limit ${f}, ${t}`, callback)
}

module.exports = {
    getPenipu,
}