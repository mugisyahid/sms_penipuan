module.exports = {
    port: 3000,
    address: 'localhost',
    appName: 'Api Aisha FSM',
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
    oracle: {
      user: "system",
      password: "arkhana",
      connectString: "(DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))(CONNECT_DATA = (SID = XE)))"
    },
    ldap: {
      url: '10.2.126.64',
      port: 389
    }
  }