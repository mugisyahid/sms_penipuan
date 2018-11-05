const mysql = require('mysql')
const kon = require('../service/dbset')

 function getListPenipu(callback) {
    kon("SELECT * from d_summary_penipu order by jumlah_pelapor limit 0,20", callback)
}

function insertDetail(body,callback){
   var query = "insert into t_sms_penipu(msisdn_target,msisdn_pelapor,content,date_system,uploader,source) "
                + "values (${body.msisdn_target},${body.msisdn_pelapor},'${body.content}',NOW(),'${body.uploader}','${body.source}')"
    kon(query,callback)
}

function update_reference(body,callback){
    var query = "update reference_penipu set status = '${body.status},updated_date = NOW(),updated_by='${body.updater} where "
                + "msisdn=${body.msisdn}"
}   

function getReference(callback){
    kon("select * from reference_penipu", callback)
}

module.exports = {getListPenipu, insertDetail, getReference, update_reference}