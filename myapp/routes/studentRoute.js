
const express = require("express");

const authController = require("../controllers/authController");
const studentController = require("../controllers/studentController");

const {
    validateStudentPayload
} = require("../helpers/validators/studentValidator");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


router.get(
    "/me",
    authMiddleware,
    studentController.getIndex
);

router.put(
    "/me",
    authMiddleware,
    studentController.updateStudent
);


router.post(
    "/",
    validateStudentPayload,
    studentController.createStudent
);


router.put(
    "/2fa/enable",
    authMiddleware,
    authController.enable2FA
);

router.put(
    "/2fa/disable",
    authMiddleware,
    authController.disable2FA
);


router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    authController.getAllUsers
);

router.put(
    "/users/:id",
    authMiddleware,
    adminMiddleware,
    authController.editUserByAdmin
);


router.put(
    "/users/:id/block",
    authMiddleware,
    adminMiddleware,
    authController.blockUser
);


router.put(
    "/users/:id/unblock",
    authMiddleware,
    adminMiddleware,
    authController.unblockUser
);


router.delete(
    "/users/:id",
    authMiddleware,
    adminMiddleware,
    authController.deleteUserByAdmin
);


router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    studentController.deleteStudent
);

module.exports = router;
