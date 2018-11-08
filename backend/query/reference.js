const kon = require('../service/dbset')
const logger = require('../service/logger')

function getReference(msisdn, callback) {
    kon.ekse(`select * from reference_penipu where msisdn = '${msisdn}' limit 1`, callback)
}

function updateReference(p, callback) {
    p.forEach(param => {
        const query = `delete reference_penipu where msisdn = '${param.msisdn}'`
        let query2 = `insert into reference_penipu values('${param.msisdn}','${param.status}','${param.updater}',NOW(),1)`
        logger.debug(query)
        kon.ekse(query, (e,r) => {
            if(e){ callback(e,null)}
            else{ kon.ekse(query2,callback)}
        })
    });
   
    
}

module.exports = {
    getReference,
    updateReference,
}