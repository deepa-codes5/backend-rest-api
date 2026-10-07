var express = require('express');
const authController = require('../controllers/authController');
const studentController = require('../controllers/studentController');
const { validateStudentPayload } = require('../helpers/validators/studentValidator');
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

var router = express.Router();

router.get('/', authMiddleware, studentController.getIndex);
router.post('/', validateStudentPayload, studentController.createStudent);
router.put('/2fa/enable', authMiddleware, authController.enable2FA);

router.put('/2fa/disable', authMiddleware, authController.disable2FA);
router.put('/:id',authMiddleware, studentController.updateStudent);
router.delete('/:id', authMiddleware,adminMiddleware, studentController.deleteStudent);

module.exports = router;