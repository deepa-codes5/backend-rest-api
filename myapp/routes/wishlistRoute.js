
const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist
} = require("../controllers/wishlistController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, addToWishlist);

router.get("/", authMiddleware, getWishlist);

router.delete("/remove/:productId", authMiddleware, removeFromWishlist);

router.delete("/clear", authMiddleware, clearWishlist);

module.exports = router;
