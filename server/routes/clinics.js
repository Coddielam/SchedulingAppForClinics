const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");
const config = require("config");

const router = express.Router();

// @route   /api/clinics/register
// @desc    Register clinic account
// @access  Public
router.post(
  "/register",
  [
    check("email", "Please double check email format").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    check("clinic_name", "Clinic name is required").not().isEmpty(),
    check("phone_num", "Phone number required").not().isEmpty(),
    check(
      "phone_num",
      "Phone number must be numbers and less than 15 characters"
    )
      .isNumeric()
      .isLength({ max: 15 }),
    check("address", "Address is required").not().isEmpty(),
  ],
  async (req, res) => {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, clinic_name, phone_num, address } = req.body;
      // check if email already registered
      let emailCount = await db.checkEmail(email);
      emailCount = emailCount[0]["COUNT(email)"];
      if (emailCount > 0) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email already registered" }] });
      }

      // Create user...
      let user = { email, password, clinic_name, phone_num, address };
      // encrypt password
      const saltRound = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, saltRound);

      await db.createClinicAcct(user);
      user = await db.getUser(email);

      // sign and send back jwt
      const payload = {
        user: {
          email: user.email,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "7d" },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token, user });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

// @route   /api/clinics/login
// @desc    Login clinic account
// @access  Public
router.post(
  "/login",
  [
    check("email", "Email is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
  ],
  async (req, res) => {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // Get user from clinics with email
      let user = await db.getUser(email);
      if (user.length === 0) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email not registered" }] });
      }
      user = user[0];

      // compare hashed password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(400).json({ errors: [{ msg: "Invalid Credential" }] });
      }

      // nothing went wrong - respond back with jwt
      const payload = {
        user: {
          email: user.email,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "7d" },
        (err, token) => {
          if (err) console.error(err);
          res.status(200).json({ user, token });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
