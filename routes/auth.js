var express = require('express');
const jwt = require("jsonwebtoken");

var { validateRegister } = require('../helpers/validators/authValidator');
const Student = require('../models/studentModel');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

var router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Auth route working',
  });
});

router.post('/register', validateRegister, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newStudent = await Student.create({ name, email, password });
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

router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  const student = await Student.findOne({ email });

  if (!student) {
    return res.status(401).json({
      message: "student not found "
    });
  }

  if (student.password !== password) {
    return res.status(401).json({
      message: "Invalid password"
    });
  }

   const token = jwt.sign(
  { id: student._id, email: student.email },
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
module.exports = router;