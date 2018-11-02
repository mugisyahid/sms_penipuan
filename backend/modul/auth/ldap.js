'use strict'

const config = require('../../config/config_all')
const logger = require('../../service/logger')

const ldap = require('ldapjs');
const client = ldap.createClient({
  url: 'ldap://' + config.ldap.url + ':' + config.ldap.port
});

exports.login = function (username, password, callback) {
  // https://stackoverflow.com/questions/40867345/catch-all-uncaughtexception-for-node-js-app
  try {
    client.bind('telkomsel\\' + username, password, function (err, result) {
      if (err) callback(err, null)
      callback(null, result)
      // let opts = {
      //   filter: '(objectClass=*)'
      // };
      // client.search("CN=" + username + ",DC=telkomsel,DC=co,DC=id", opts, function (err, res) {
      //   // Code to handle the result
      //   if (err) {
      //     console.log('Error occurred while ldap search');
      //   } else {
      //     res.on('searchEntry', function (entry) {
      //       console.log('Entry', JSON.stringify(entry.object));
      //     });
      //     res.on('searchReference', function (referral) {
      //       console.log('Referral', referral);
      //     });
      //     res.on('error', function (err) {
      //       console.log('Error is', err);
      //     });
      //     res.on('end', function (result) {
      //       console.log('Result status', result.status);
      //     });
      //   }
      // });
    });
  } catch (ex) {
    logger.error(ex)
    callback('error to login', null)
  }
}