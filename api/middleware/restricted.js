const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../auth/secrets");

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "token required" });
    return;
  }
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    req.jwt = decodedToken;
    if (err) {
      console.log(err);
      res.status(401).json({ message: "token invalid" });
      return;
    }
    next();
  });
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
