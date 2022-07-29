const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  if(!req.headers.Authorization){
    res.status(401).json({ message: 'token required'})
    return
  }
  jwt.verify(req.headers.Authorization, 'shh', (err, decodedToken) => {
    req.jwt = decodedToken
    if(err){
      res.status(401).json({ message: 'token invalid'})
      return
    }
    next();
  })
  
  
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
