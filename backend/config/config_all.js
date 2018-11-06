module.exports = {
    port: 4000,
    address: 'localhost',
    appName: 'SMS Penipuan FSM',
    timeStampFile: './var/timeStamp.txt',
    appMode: 'test',
    bcrypt: 10,
    limitPayload: '20mb',
    sequencePrefix: 'TKT',
    token: {
      hashSecret: 'supersecretstring',
      header: 'authorization',
      headerToken: 'Bearer ',
      expired: 4
    },
    mysql: {
      host: "localhost",
      port: 3306,
      user: "root", 
      //password: "apps@2014",
      database: "sms_penipuan",
      connectionLimit: 10,
      debug: false
    },
    mysql2: {
      host: "localhost",
      port: 3306,
      user: "root",
      database: "sms_penipuan",
      connectionLimit: 10,
      debug: false
    },
    mysql3: {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "",
      database: "",
      connectionLimit: 10,
      debug: false
    },
    ldap: {
      url: '10.2.126.64',
      port: 389
    }
  }