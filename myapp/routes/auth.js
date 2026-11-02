
const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const { validateRegister } = require("../helpers/validators/authValidator");
const Student = require("../models/studentModel");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


router.get("/", (req, res) => {
  res.json({
    message: "hey this is deepa"
  });
});


router.get("/register", (req, res) => {
  res.json({
    message: "register route is created"
  });
});


router.post("/register", validateRegister, async (req, res) => {
  let newStudent;

  try {
    const { name, email, password, mobileNumber } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    console.log("REGISTER EMAIL:", normalizedEmail);

  
    const existingUser = await Student.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

   
    const otp = crypto.randomInt(100000, 1000000).toString();

    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    newStudent = await Student.create({
      name,
      email: normalizedEmail,
      password,
      mobileNumber,
      otp,
      isVerified: false,
      otpExpires
    });

    console.log("SENDER EMAIL:", process.env.EMAIL_USER);
console.log("RECEIVER EMAIL:", normalizedEmail);


    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "MyApp - Email Verification OTP",
      text: `Hello ${name},

Your OTP is ${otp}.

This OTP is valid for 5 minutes.

Thank you,
MyApp Team`
    });

    console.log("OTP EMAIL SENT TO:", normalizedEmail);

    return res.status(201).json({
      message: "Registration successful. OTP sent to your email."
    });

  } catch (error) {

    console.log("REGISTER ERROR:", error.message);

    if (newStudent) {
      try {
        await Student.findByIdAndDelete(newStudent._id);
      } catch (deleteError) {
        console.log("USER CLEANUP ERROR:", deleteError.message);
      }
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    return res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});



router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const student = await Student.findOne({
      email: normalizedEmail
    });

    if (!student) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (student.isVerified) {
      return res.status(400).json({
        message: "Email already verified"
      });
    }

    if (!student.otp || !student.otpExpires) {
      return res.status(400).json({
        message: "OTP not found. Please register again."
      });
    }

    if (student.otp !== String(otp).trim()) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (student.otpExpires.getTime() < Date.now()) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    student.isVerified = true;
    student.otp = undefined;
    student.otpExpires = undefined;

    await student.save();

    return res.status(200).json({
      message: "OTP verified successfully"
    });

  } catch (error) {

    console.log("OTP VERIFY ERROR:", error.message);

    return res.status(500).json({
      message: "OTP verification failed",
      error: error.message
    });
  }
});



router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const student = await Student.findOne({
      email: normalizedEmail
    });

    if (!student) {
      return res.status(401).json({
        message: "Student not found"
      });
    }

    if (student.isBlocked === true) {
      return res.status(403).json({
        message: "Admin blocked your account"
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

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in .env");
    }

    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
        role: student.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {

    console.log("LOGIN ERROR:", error.message);

    return res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});


router.get("/me", authMiddleware, authController.getUserById);

router.put("/me", authMiddleware, authController.editUserById);

router.delete("/me", authMiddleware, authController.deleteUserById);



router.post(
  "/all-users",
  authMiddleware,
  adminMiddleware,
  authController.getAllUsers
);

router.post(
  "/edit-user/:id",
  authMiddleware,
  adminMiddleware,
  authController.editUserByAdmin
);

router.post(
  "/delete-user/:id",
  authMiddleware,
  adminMiddleware,
  authController.deleteUserByAdmin
);

module.exports = router;
