const kon = require('../service/dbset')

function getReference(msisdn, callback) {
    kon.ekse(`select * from reference_penipu where msisdn = '${msisdn}' limit 1`, callback)
}

module.exports = {
    getReference,
}