
const SupportTicket = require("../models/supportTicketModel");

// CREATE SUPPORT TICKET
const createTicket = async (req, res) => {
    try {
        const {
            name,
            email,
            subject,
            category,
            priority,
            message
        } = req.body;

        if (!name || !email || !subject || !category || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const ticket = await SupportTicket.create({
            ticketId: `TK${Date.now()}`,
            userId: req.user.id,
            name,
            email,
            subject,
            category,
            priority: priority || "Medium",
            message
        });

        res.status(201).json({
            success: true,
            message: "Support ticket created successfully",
            ticket
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create support ticket",
            error: error.message
        });
    }
};


// GET MY SUPPORT TICKETS
const getMyTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({
    userId: req.user.id
}).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tickets.length,
            tickets
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch tickets",
            error: error.message
        });
    }
};


module.exports = {
    createTicket,
    getMyTickets
};
