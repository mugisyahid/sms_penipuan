'use strict'

const dbConfig = require('../config')
const oracledb = require('oracledb')
const logger = require('../service/logger')

let connectionPool

function init(callback) {
    oracledb.outFormat = oracledb.OBJECT;
    oracledb.fetchAsString = [ oracledb.CLOB ];
    oracledb.createPool(
        {
            user: dbConfig.oracle.user,
            password: dbConfig.oracle.password,
            connectString: dbConfig.oracle.connectString
            // Default values shown below
            // events: false, // whether to handle Oracle Database FAN and RLB events
            // externalAuth: false, // whether connections should be established using External Authentication
            // poolAlias: 'myalias' // set an alias to allow access to the pool via a name
            // poolIncrement: 1, // only grow the pool by one connection at a time
            // poolMax: 4, // maximum size of the pool. Increase UV_THREADPOOL_SIZE if you increase poolMax
            // poolMin: 0, // start with no connections let the pool shrink completely
            // poolPingInterval: 60, // check aliveness of connection if in the pool for 60 seconds
            // poolTimeout: 60, // terminate connections that are idle in the pool for 60 seconds
            // queueRequests: true, // let Node.js queue new getConnection() requests if all pool connections are in use
            // queueTimeout: 60000, // terminate getConnection() calls in the queue longer than 60000 milliseconds
            // stmtCacheSize: 30 // number of statements that are cached in the statement cache of each connection
        },
        function (err, pool) {
            if (err) {
                logger.error("createPool() error: " + err.message)
                callback(err, pool)
            } else {
                logger.debug('create connection pool succesfully: ' + JSON.stringify(pool))
                callback(err, pool)
            }
        }
    )
}


function executeQuery(query, param, opt, callback) {
    // Checkout a connection from the pool
    init(function (err, connectionPool) {
        connectionPool.getConnection(function (err, connection) {
            if (err) {
                logger.error("get connection error: "+ err)
            } else {
                logger.debug("Connections open: " + connectionPool.connectionsOpen)
                logger.debug("Connections in use: " + connectionPool.connectionsInUse)
                // logger.debug(JSON.stringify(param))
                logger.debug(query)
                logger.debug(JSON.stringify(opt))
                connection.execute(query, param, opt, // bind variable value
                    function (err, result) {
                        if (err) {
                            connection.close(function (err) {
                                if (err) {
                                    // Just logging because handleError call below will have already
                                    // ended the response.
                                    logger.error("execute() error release() error", err)
                                }
                            })
                            callback(err, null)
                        }
                        callback(null, result)

                        /* Release the connection back to the connection pool */
                        connection.close(function (err) {
                            if (err) {
                                logger.error('error closing connection: ' + err)
                            } else {
                                logger.debug('release the connection')
                            }
                        })
                    }
                )
            }
        })
    })
}


module.exports = executeQuery