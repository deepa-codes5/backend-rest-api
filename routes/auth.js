var express = require('express');
const jwt = require("jsonwebtoken");

var { validateRegister } = require('../helpers/validators/authValidator');
const Student = require('../models/studentModel');
const authMiddleware = require('../middleware/authMiddleware')

var router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Auth route working',
  });
});

router.post('/register', validateRegister, (req, res) => {
  res.status(201).json({
    message: 'User registered successfully',
    payload: req.body,
  });
});

router.get('/login',(req,res)=>{
  res.status(200).json({
    message:'login route created'
  })
})

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
module.exports = router, authMiddleware;