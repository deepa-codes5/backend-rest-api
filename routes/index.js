var express = require('express');
const { body,validationResult,checkExact } = require("express-validator");
const studentController = require("../controllers/studentController");
var router = express.Router();
router.get("/", studentController.getIndex);
router.post(
    "/",
     checkExact([
        body("name"),
        body("email"),
        body("password"),
        body("mobile")
    ]),
    body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string "),

     body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail()
        .withMessage("invalid email")
        ,

    body("password")
        .notEmpty().withMessage("Password is required")
        .isInt()
        .withMessage("Password must be a number "),
        

    body("mobile")
        .notEmpty().withMessage("Mobile number is required")
        .isInt().withMessage("Mobile number is not a integer")
        .isLength({ min: 10, max: 10 })
        .withMessage("Mobile number is not valid"),
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }else{
            res.json({ message: "Success" });
        }

        next();
    },

    studentController.createStudent
);
router.put("/:id", studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);



module.exports = router;
