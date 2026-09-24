const Student = require("../models/studentModel");

const getUserById = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);

        if (!student) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            student: student
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch user",
            error: error.message
        });
    }
};

const editUserById = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.user.id,
            req.body,
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User updated successfully",
            student: student
        });

    } catch (error) {
        res.status(500).json({
            message: "User update failed",
            error: error.message
        });
    }
};

const deleteUserById = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.user.id);

        if (!student) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully", student });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

module.exports = {
    getUserById,
    editUserById,
    deleteUserById
};