const mysql = require('mysql')
const kon = require('../service/dbset')

 function getListPenipu(callback) {
    kon("SELECT * from d_summary_penipu order by jumlah_pelapor limit 0,20", callback)
}



module.exports = {getListPenipu}