var express = require('express');

const studentController = require('../controllers/studentController');
const { validateStudentPayload } = require('../helpers/validators/studentValidator');

var router = express.Router();

router.get('/', studentController.getIndex);
router.post('/', validateStudentPayload, studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;