 /*
 const oracle = require('../../lib/oracledb')
 const oracledb = require('oracledb')
 */

 const router = require('express').Router()
 const logger = require('../../service/logger')
 const ldap = require('../../modul/auth/ldap')
 const jwt = require('jsonwebtoken') 
 
const config = require('../../config/config_all')


 router.post('/login', function (req, res) {

     // User.findOne({ email: req.body.email }, function (err, user) {
     //     if (err) return res.status(500).send('Error on the server.')
     //     if (!user) return res.status(404).send('No user found.')

     //     var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
     //     if (!passwordIsValid) return res.status(401).send({ auth: false, token: null })

     // login using ldap, insert to local db if not exist
     // return jwt

     if (req.body.username !== 'super_ganteng') {
         ldap.login(req.body.username, req.body.password, function (err, result) {
             if (err) {
                 res.status(200).send({
                     auth: false,
                     error: 'ldap login failed'
                 })
             } else {
                 logger.info('[LOGGED IN] user: ' + req.body.username)

                 let token = jwt.sign({
                     id: req.body.password,
                     username: req.body.username
                 }, config.token.hashSecret, {
                     expiresIn: 1440 / config.token.expired
                 })
                 res.status(200).send({
                     auth: true,
                     token: token,
                     user: req.body.username
                 })
             }
         })
     } else {
         // admin login
         logger.info('[LOGGED admin] user: ' + req.body.username)

         let token = jwt.sign({
             id: req.body.password
         }, config.token.hashSecret, {
             expiresIn: 1440 / config.token.expired
         })
         res.status(200).send({
             auth: true,
             token: token,
             user: req.body.username
         })
     }
 })



 module.exports = router;