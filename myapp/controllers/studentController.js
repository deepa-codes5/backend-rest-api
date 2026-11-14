
const Student = require("../models/studentModel");


const getIndex = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id)
            .select("-password -otp -otpExpires");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message
        });
    }
};


const createStudent = async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json({
            message: "Student created successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: "Student creation failed",
            error: error.message
        });
    }
};


const updateStudent = async (req, res) => {
    try {
        const { name, mobileNumber, address, country } = req.body;

        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (mobileNumber !== undefined) updateData.mobileNumber = mobileNumber;
        if (address !== undefined) updateData.address = address;
        if (country !== undefined) updateData.country = country;

        const student = await Student.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password -otp -otpExpires");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update settings",
            error: error.message
        });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.user.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student deleted successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting student",
            error: error.message
        });
    }
};


module.exports = {
    getIndex,
    createStudent,
    updateStudent,
    deleteStudent
};
