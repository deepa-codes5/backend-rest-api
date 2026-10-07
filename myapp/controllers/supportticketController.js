const SupportTicket = require("../models/supportTicketModel");

const createTicket = async (req, res) => {
    try {

        const { subject, message } = req.body;

        const ticket = await SupportTicket.create({
            userId: req.user.id,
            subject: subject,
            message: message
        });

        res.status(201).json({
            message: "Support ticket created successfully",
            ticket: ticket
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to create support ticket",
            error: error.message
        });

    }
};

module.exports = {
    createTicket
};