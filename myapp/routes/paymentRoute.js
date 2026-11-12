
const express = require("express");
const router = express.Router();

const {
  createPayment,
  getUserPayments
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

// CREATE PAYMENT
router.post("/create", authMiddleware, createPayment);

// GET USER PAYMENTS
router.get("/", authMiddleware, getUserPayments);

module.exports = router;
