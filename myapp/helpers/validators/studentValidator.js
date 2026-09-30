const { body, validationResult } = require('express-validator');
const studentRules = [
body("name").notEmpty().withMessage("Name is required").isString().withMessage("Name must be a string"),
body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("invalid email"), 
body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
body("mobile") .notEmpty().withMessage("Mobile number is required").isInt().withMessage("Mobile number is not a integer").isLength({ min: 10, max: 10 }).withMessage("Mobile number is not valid")]


const validateStudentPayload = [
  ...studentRules,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];

module.exports = {
  studentRules,
  validateStudentPayload,
};