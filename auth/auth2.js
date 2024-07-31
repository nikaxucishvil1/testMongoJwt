const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateTokenTwo = (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];

  if (token == null) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

module.exports = authenticateTokenTwo;
