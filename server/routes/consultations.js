const express = require("express");
const db = require("../db");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/consultations
// @desc    Create consultation record
// @access  Private
router.post(
  "/",
  [
    auth,
    check("clinic_id", "Clinic ID's field is required").not().isEmpty(),
    check("doctor_name", "Doctor's name is required").not().isEmpty(),
    check("patient_name", "Patient's name is required").not().isEmpty(),
    check("consultation_fee", "Consultation fee name is required")
      .not()
      .isEmpty(),
    check("datetime", "Date and time of consultation required").not().isEmpty(),
  ],
  async (req, res) => {
    // validation errors handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await db.createConsultation(req.body);
      res.json({ msg: "Consultation Created" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

// @route   /api/consultations
// @desc    Get all consultation records based on clinic_id
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    let result = await db.getAllConsultRecords(req.user.user.email);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
