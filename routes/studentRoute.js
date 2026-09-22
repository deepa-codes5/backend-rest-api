var express = require('express');

const studentController = require('../controllers/studentController');
const { validateStudentPayload } = require('../helpers/validators/studentValidator');
const authMiddleware = require("../middleware/authMiddleware");

var router = express.Router();

router.get('/', authMiddleware, studentController.getIndex);
router.post('/', validateStudentPayload, studentController.createStudent);
router.put('/:id',authMiddleware, studentController.updateStudent);
router.delete('/:id', authMiddleware, studentController.deleteStudent);

module.exports = router;