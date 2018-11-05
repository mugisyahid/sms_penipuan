
const logger = require('../service/logger')
var mysql      = require('mysql');

var lokal = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : ''
});

lokal.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    logger.error("createPool() error: " + err.message)
    return;
  }
  logger.debug('create connection pool succesfully: ' + JSON.stringify(pool))
  console.log('connected as id ' + lokal.threadId);
});

var connection = mysql.createConnection({
    host     : 'example.org',
    user     : 'bob',
    password : 'secret'
  });
  
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
 
    console.log('connected as id ' + connection.threadId);
  });