var express = require('express');

var { validateRegister } = require('../helpers/validators/authValidator');

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

module.exports = router;