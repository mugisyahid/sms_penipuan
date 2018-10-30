const config = require('../config/config_all')
const oracle = require('../lib/oracledb')
const oracledb = require('oracledb')
const Promise = require('promise')
//const ceking = require('cek_channel')
const moment = require('moment')



function insert (params, callback) {

    let querys = `INSERT INTO KYC_PHOTO(DATE_TIME,MSISDN,UNIT_ID,BASE_64,NOTES,TRX_ID,CHANNEL) VALUES (TO_TIMESTAMP(CURRENT_DATE, 'YYYY-MM-DD HH24:MI:SS'),'${params.msisdn}','${params.unit_id}', '${params.base64}', '${params.notes}','${params.trx_id}','${params.channel_name}')`
    console.log(querys)
    params.channel = params.channel ? params.channel : ''
    oracle(querys, [], { autoCommit: true }, function (err, result) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, result) // array result
            }
        })
}

function inserts (params, callback) {
    params.channel = params.channel ? params.channel : ''
    let querys = `INSERT INTO KYC_FINGERPRINT(DATE_TIME,MSISDN,UNIT_ID,BASE_64,NOTES,TRX_ID,EMPLOYEE_ID,CHANNEL) VALUES (TO_TIMESTAMP(CURRENT_DATE, 'YYYY-MM-DD HH24:MI:SS'),
${params.msisdn}, ${params.unit_id}, '${params.base64}', '${params.notes}','${params.trx_id}','${params.employee_id}','${params.channel_name}')`
    oracle(querys, [], { autoCommit: true }, function (err, result) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, result) // array result
                // var b
            }
        })
}

function cek_unit (crot, callback) {
    let query = `select * from CSDM_UNIT_BRANCH where UNIT_ID = '${crot}' and UNIT_FLAG = 1`
    console.log(query)
    oracle(query, [], { autoCommit: true }, function (err, result) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, result) // array result
            }
        })
}

function insert_sidik(body,callback){
	body.unit_id = body.unit_id ? body.unit_id : ''
    var hlr = ['62811', '62812', '62813', '62821', '62822', '62823', '62851', '62852', '62853']
    var subMsisdn = body.msisdn.substring(0, 5);
    console.log(subMsisdn)
    console.log(hlr.includes(subMsisdn))
	cek_unit(body.unit_id,function(error,result){
        if(error){res.status(200).send(error)}
        else{
            console.log(result)
            if(result.rows.length < 1 && body.unit_id != ''){
		     callback("{ trx id: " +body.trx_id+ ", error_code: 'ERR031', Message : Unregistered UNIT ID' }",null)
			}
			else if(hlr.includes(subMsisdn)=== false){
			 callback("{ trx id: " +body.trx_id+ ", error_code: 'ERR022', Message : WRONG MSISDN FORMAT' }",null)
			}	
			else if(body.msisdn.length < 10 || body.msisdn.length > 14 ){
			 callback("{ trx id: " +body.trx_id+ ", error_code: 'ERR022', Message : WRONG MSISDN FORMAT' }",null)
			}else if(!isNaN(body.msisdn)){
			callback("{ trx id: " +body.trx_id+ ", error_code: 'ERR021', Message : NON NUMERIC MSISDN INPUT' }",null)	
			}else if(!body.trx_id){
				callback("{ trx id: " +body.trx_id+ ", error_code: 'ERR0011', Message : General Error, TRX ID NOT PROVIDED' }",null)
			}else if(!body.msisdn){ 
				callback("{ trx id: " +body.trx_id+ ", error_code: 'ERR0011', Message : General Error, MSISDN NOT PROVIDED' }",null)
			}else if(!body.base64){ 
				callback("{ trx id: " +body.trx_id+ ", error_code: 'ERR0011', Message : General Error, BASE64 NOT PROVIDED' }",null)
			}else{
				
				let query_str = `select * from CSDM_EMPLOYEE where NIK = ${body.employee_id} && UNIT_ID = ${body.unit_id}`;
			  //  var query_var = [name];
				oracle(cucur, [], { autoCommit: true }, function (e, r) {
					if (err) {
						callback(e, null)
					} else {
						console.log(r)
					    if(r.rows.length < 1 && body.employee_id != ''){
						callback("{ trx id: " +body.trx_id+ ", error_code: 'ERR051', Message : Unregistered employee_id' }",null)
						}else{
							
						}
					}
				})
				
				inserts(body,callback)
			}
		}
	})
	
    

}

function insert_foto(body,callback){
	body.unit_id = body.unit_id ? body.unit_id : ''
    var hlr = ['62811', '62812', '62813', '62821', '62822', '62823', '62851', '62852', '62853']
    var subMsisdn = body.msisdn.substring(0, 5);
    console.log(subMsisdn)
    console.log(hlr.includes(subMsisdn))
    cek_unit(body.unit_id,function(error,result){
        if(error){res.status(200).send(error)}
        else{
            console.log(result)
            if(result.rows.length < 1 && body.unit_id != ''){
		     callback(body.trx_id+ " + 31 Unregistered unit_id",null)
			}
			else if(hlr.includes(subMsisdn)=== false){
			 callback("{ trx id: " +body.trx_id+ ", error_code: 'ERR022', Message : WRONG MSISDN FORMAT' }",null)
			}	
			else if(body.msisdn.length < 10 || body.msisdn.length > 14 ){
			 callback("{ trx id: " +body.trx_id+ ", error_code: 'ERR022', Message : WRONG MSISDN FORMAT' }",null)
			}else if(!isNaN(body.msisdn)){
			callback("{ trx id: " +body.trx_id+ ", error_code: 'ERR021', Message : NON NUMERIC MSISDN INPUT' }",null)	
			}else if(!body.trx_id){
				callback("{ trx id: " +body.trx_id+ ", error_code: 'ERR0011', Message : General Error, TRX ID NOT PROVIDED' }",null)
			}else if(!body.msisdn){ 
				callback("{ trx id: " +body.trx_id+ ", error_code: 'ERR0011', Message : General Error, MSISDN NOT PROVIDED' }",null)
			}else if(!body.base64){ 
				callback("{ trx id: " +body.trx_id+ ", error_code: 'ERR0011', Message : General Error, BASE64 NOT PROVIDED' }",null)
			}else{
				insert(body,callback)
			}
		}
	})


    

}
module.exports = {insert_foto,insert_sidik}