var express = require('express');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

var { validateRegister } = require('../helpers/validators/authValidator');
const Student = require('../models/studentModel');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

var router = express.Router();
const transporter = nodemailer.createTransport({ service: "gmail", auth: { user: "deepaoffical511@gmail.com", pass: "xzia mwai bvlh cgyu" } });

router.get('/', (req, res) => {
  res.json({
    message: 'hey this is deepa',
  });
});
router.get('/register', (req, res) => {
  res.json({
    message: 'register route is created',
  });
});


router.post('/register', validateRegister, async (req, res) => {
  try {

    const { name, email, password, mobileNumber } = req.body;


    const otp = crypto.randomInt(100000, 1000000).toString();

    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const newStudent = await Student.create({
      name,
      email,
      password,
      mobileNumber,
      otp: otp,
      isVerified: false,
      otpExpires: otpExpires
    });
    console.log("GENERATED OTP:", otp);

    await transporter.sendMail({
      from: "deepaofficial511@gmail.com",
      to: email,
      subject: "Your OTP",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`
    });

    return res.status(201).json({
      message: 'User registered successfully',
      payload: newStudent
    });

  } catch (error) {

    return res.status(500).json({
      message: 'Registration failed',
      error: error.message
    });

  }
});

router.post('/verify-otp', async (req, res) => {
  try {

    const { email, otp } = req.body;

    const student = await Student.findOne({ email });
console.log("FULL STUDENT:", student);
console.log("DB OTP:", student?.otp);

    // User check
    if (!student) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // OTP check
    if (student.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    // OTP expiry check
    if (student.otpExpires < new Date()) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    // Verification success
    student.isVerified = true;
    student.otp = undefined;
    student.otpExpires = undefined;

    await student.save();

    return res.status(200).json({
      message: "OTP verified successfully"
    });

  } catch (error) {

    return res.status(500).json({
      message: "OTP verification failed",
      error: error.message
    });

  }
});

router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  const student = await Student.findOne({ email });

  if (!student) {
    return res.status(401).json({
      message: "student not found "
    });
  }
  if (!student.isVerified) {
    return res.status(403).json({
      message: "Please verify your email first"
    });
  }

  if (student.password !== password) {
    return res.status(401).json({
      message: "Invalid password"
    });
  }

  const token = jwt.sign(
    {
      id: student._id,
      email: student.email,
      role: student.role
    },
    "mySecretKey",
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    message: "Login successful",
    token: token
  });


});
router.get('/me', authMiddleware, authController.getUserById);
router.put('/me', authMiddleware, authController.editUserById);
router.delete('/me', authMiddleware, authController.deleteUserById)
router.post(
    '/all-users',
    authMiddleware,
    adminMiddleware,
    authController.getAllUsers
);
router.post(
    '/edit-user/:id',
    authMiddleware,
    adminMiddleware,
    authController.editUserByAdmin
);
router.post(
    '/delete-user/:id',
    authMiddleware,
    adminMiddleware,
    authController.deleteUserByAdmin
);
module.exports = router;