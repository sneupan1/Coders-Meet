const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/user");

const auth = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).send({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.get("JWT_SECRET"));
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ msg: "Token is not valid" });
  }
};

module.exports = auth;
