const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../models/user");

//  @route      GET api/auth
//  @desc       Test route
//  @access     public
router.get("/", auth, (req, res) => res.send(req.user));

//  @route      POST api/auth
//  @desc       Authenticate user & get token
//  @access     public
router.post(
  "/",
  [
    check("email", "Please include a valid email address").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      const user = await User.findByCredentials(email, password);
      const token = await user.generateAuthTokens();
      res.status(200).send({ token });
    } catch (err) {
      res.status(400).send({ errors: [{ msg: err.message }] });
    }
  }
);

module.exports = router;
