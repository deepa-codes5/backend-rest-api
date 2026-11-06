
const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

// Add product to cart
router.post("/add", authMiddleware, cartController.addToCart);

// Get user cart
router.get("/", authMiddleware, cartController.getCart);
// Update cart quantity
router.put("/update", authMiddleware, cartController.updateCart);

// Remove product from cart
router.delete("/remove/:productId", authMiddleware, cartController.removeFromCart);

module.exports = router;
