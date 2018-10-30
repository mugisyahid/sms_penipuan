var jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
  var token = req.headers['access-token'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'ERR082 : No token provided.' });
  jwt.verify(token, 'Gantengs', function(err, decoded) {
    if (err)
    return res.status(500).send({ auth: false, message: 'ERR081 : Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.channelId = decoded.id;
    
    next();
  });
}
module.exports = verifyToken;