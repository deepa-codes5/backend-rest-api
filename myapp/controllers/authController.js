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
const getAllUsers = async (req, res) => {
    try {

        const students = await Student.find().select("-password -otp -otpExpires");

        res.status(200).json({
            students: students
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });

    }
};
const editUserByAdmin = async (req, res) => {
    try {

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const safeStudent = await Student.findById(req.params.id)
            .select("-password -otp -otpExpires");

        res.status(200).json({
            message: "User updated successfully",
            student: safeStudent
        });

    } catch (error) {

        res.status(500).json({
            message: "User update failed",
            error: error.message
        });

    }
};
const deleteUserByAdmin = async (req, res) => {
    try {

        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "User deletion failed",
            error: error.message
        });

    }
};
const enable2FA = async (req, res) => {
    try {
        console.log("USER FROM TOKEN:", req.user);
        const student = await Student.findById(req.user.id);

        if (!student) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        student.twoFactorEnabled = true;

        await student.save();

        res.status(200).json({
            message: "2FA enabled successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to enable 2FA",
            error: error.message
        });
    }
};


const disable2FA = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);

        if (!student) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        student.twoFactorEnabled = false;

        await student.save();

        res.status(200).json({
            message: "2FA disabled successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to disable 2FA",
            error: error.message
        });
    }
};
module.exports = {
    getUserById,
    editUserById,
    deleteUserById,
    getAllUsers,
    editUserByAdmin,
    deleteUserByAdmin,
    enable2FA,
    disable2FA
};