
const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventoryController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  inventoryController.getInventory
);

module.exports = router;
