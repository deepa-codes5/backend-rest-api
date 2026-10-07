var express = require("express");

const supportTicketController = require("../controllers/supportticketController");
const authMiddleware = require("../middleware/authMiddleware");

var router = express.Router();

router.post(
    "/",
    authMiddleware,
    supportTicketController.createTicket
);

module.exports = router;