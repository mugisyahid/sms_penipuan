const kon = require('../service/dbset')
const logger = require('../service/logger')

function getReference(msisdn, callback) {
    kon.ekse(`select * from reference_penipu where msisdn = '${msisdn}' limit 1`, callback)
}

function updateReference(param, callback) {
    const query = `update reference_penipu set status = '${param.status}', updated_date = now(), updated_by = '${param.updater}' where msisdn = '${param.msisdn}'`
    logger.debug(query)
    kon.ekse(query, callback)
}

module.exports = {
    getReference,
    updateReference,
}