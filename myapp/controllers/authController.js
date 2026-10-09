
const Student = require("../models/studentModel");


const getUserById = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id)
            .select("-password -otp -otpExpires");

        if (!student) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({ student });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch user",
            error: error.message
        });
    }
};



const editUserById = async (req, res) => {
    try {
        const { name, email, mobileNumber } = req.body;

        const updates = {};

        if (name !== undefined) updates.name = name;
        if (email !== undefined) updates.email = email;
        if (mobileNumber !== undefined) {
            updates.mobileNumber = mobileNumber;
        }

        const student = await Student.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password -otp -otpExpires");

        if (!student) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User updated successfully",
            student
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
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting user",
            error: error.message
        });
    }
};



const getAllUsers = async (req, res) => {
    try {
        const page = Math.max(
            1,
            parseInt(req.query.page, 10) || 1
        );

        const limit = Math.min(
            100,
            Math.max(1, parseInt(req.query.limit, 10) || 5)
        );

        const skip = (page - 1) * limit;

        const [students, totalUsers] = await Promise.all([
            Student.find()
                .select("-password -otp -otpExpires")
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limit),

            Student.countDocuments()
        ]);

        res.status(200).json({
            message: "Users fetched successfully",
            students,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit),
                totalUsers,
                limit
            }
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
        const { name, email, mobileNumber, role } = req.body;

        if (req.user.id === req.params.id && role === "user") {
            return res.status(400).json({
                message: "Admin cannot remove their own admin role"
            });
        }

        const updates = {};

        if (name !== undefined) updates.name = name;
        if (email !== undefined) updates.email = email;
        if (mobileNumber !== undefined) {
            updates.mobileNumber = mobileNumber;
        }

        if (role !== undefined) {
            if (!["admin", "user"].includes(role)) {
                return res.status(400).json({
                    message: "Invalid role"
                });
            }

            updates.role = role;
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password -otp -otpExpires");

        if (!student) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User updated successfully",
            student
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
        if (req.user.id === req.params.id) {
            return res.status(400).json({
                message: "Admin cannot delete their own account here"
            });
        }

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



const blockUser = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            return res.status(400).json({
                message: "Admin cannot block their own account"
            });
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: { isBlocked: true } },
            { new: true, runValidators: true }
        ).select("-password -otp -otpExpires");

        if (!student) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User blocked successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to block user",
            error: error.message
        });
    }
};



const unblockUser = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: { isBlocked: false } },
            { new: true, runValidators: true }
        ).select("-password -otp -otpExpires");

        if (!student) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User unblocked successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to unblock user",
            error: error.message
        });
    }
};



const enable2FA = async (req, res) => {
    try {
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
    blockUser,
    unblockUser,
    enable2FA,
    disable2FA
};

