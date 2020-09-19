const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) res.status(401).json({ msg: "Unauthorized access" });

  try {
    const decrypted = jwt.verify(token, config.get("jwtSecret"));
    req.user = decrypted;

    next();
  } catch (err) {
    return res.status(400).json({ msg: "Invalid token" });
  }
};
