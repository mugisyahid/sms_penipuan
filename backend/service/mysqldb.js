'use strict'

const mysql = require('mysql')
const config = require('../config/config_all')

const pool = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
})

const pool2 = mysql.createPool({
  host: config.mysql2.host,
  user: config.mysql2.user,
  password: config.mysql2.password,
  database: config.mysql2.database
})


const pool3 = mysql.createPool({
  host: config.mysql3.host,
  user: config.mysql3.user,
  password: config.mysql3.user,
  database: config.mysql3.database
})

let db = (function () {
  function _query(query, params, callback) {
    pool.getConnection(function (err, connection) {
      if (err) {
        connection.release()
        callback(null, err)
        throw err
      }

      connection.query(query, params, function (err, rows) {
        connection.release()
        if (!err) {
          callback(rows)
        }
        else {
          callback(null, err)
        }

      })

      connection.on('error', function (err) {
        connection.release()
        callback(null, err)
        throw err
      })
    })
  }
  return {
    query: _query
  }
})()

let db2 = (function () {
  function _query(query, params, callback) {
    pool2.getConnection(function (err, connection) {
      if (err) {
        connection.release()
        callback(null, err)
        throw err
      }

      connection.query(query, params, function (err, rows) {
        connection.release()
        if (!err) {
          callback(rows)
        }
        else {
          callback(null, err)
        }

      })

      connection.on('error', function (err) {
        connection.release()
        callback(null, err)
        throw err
      })
    })
  }
  return {
    query: _query
  }
})()

let db3 = (function () {
  function _query(query, params, callback) {
    pool3.getConnection(function (err, connection) {
      if (err) {
        connection.release()
        callback(null, err)
        throw err
      }

      connection.query(query, params, function (err, rows) {
        connection.release()
        if (!err) {
          callback(rows)
        }
        else {
          callback(null, err)
        }

      })

      connection.on('error', function (err) {
        connection.release()
        callback(null, err)
        throw err
      })
    })
  }
  return {
    query: _query
  }
})()

module.exports = {db, db2, db3}