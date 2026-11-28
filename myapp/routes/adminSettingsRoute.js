
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const adminSettingsController = require("../controllers/adminSettingsController");

// Get Admin Settings
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    adminSettingsController.getAdminSettings
);

// Update Admin Profile
router.put(
    "/profile",
    authMiddleware,
    adminMiddleware,
    adminSettingsController.updateAdminProfile
);

// Change Admin Password
router.put(
    "/change-password",
    authMiddleware,
    adminMiddleware,
    adminSettingsController.changeAdminPassword
);

// Update Notifications
router.put(
    "/notifications",
    authMiddleware,
    adminMiddleware,
    adminSettingsController.updateNotifications
);

// Update Two Factor Authentication
router.put(
    "/two-factor",
    authMiddleware,
    adminMiddleware,
    adminSettingsController.updateTwoFactor
);

module.exports = router;
