const kon = require('../service/dbset') // not sure where is it

function getDetailSMS(msisdn, callback) {
    kon.ekse(`select * from t_sms_penipu where msisdn_target = '${msisdn}'`, callback)
}

module.exports = {
    getDetailSMS,
}