
const Payment = require("../models/paymentModel");

// CREATE PAYMENT
const createPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, paymentMethod } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required"
      });
    }

    if (!["UPI", "CARD", "COD"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method"
      });
    }

    // Create payment
    const payment = await Payment.create({
      user: userId,
      amount,
      paymentMethod,
      paymentStatus:
        paymentMethod === "COD" ? "PENDING" : "PENDING"
    });

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET USER PAYMENTS
const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createPayment,
  getUserPayments
};
