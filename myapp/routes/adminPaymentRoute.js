
const express = require("express");
const router = express.Router();

const {
  getAllPayments
} = require("../controllers/adminPaymentController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllPayments
);

module.exports = router;
