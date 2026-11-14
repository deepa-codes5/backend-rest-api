
const express = require("express");
const router = express.Router();

const supportTicketController = require("../controllers/supportticketController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
    "/create",
    authMiddleware,
    supportTicketController.createTicket
);

router.get(
    "/my-tickets",
    authMiddleware,
    supportTicketController.getMyTickets
);

module.exports = router;
