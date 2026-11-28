
const Student = require("../models/studentModel");
const bcrypt = require("bcryptjs");

// GET ADMIN SETTINGS
const getAdminSettings = async (req, res) => {
    try {
        const admin = await Student.findOne({
            _id: req.user.id,
            role: "admin"
        }).select("-password -otp -otpExpires");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Admin settings fetched successfully",
            admin
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch settings",
            error: error.message
        });
    }
};


// UPDATE ADMIN PROFILE
const updateAdminProfile = async (req, res) => {
    try {
        const { name, email, mobileNumber } = req.body;

        const updates = {};

        if (name !== undefined) updates.name = name.trim();
        if (email !== undefined) updates.email = email.trim().toLowerCase();
        if (mobileNumber !== undefined) updates.mobileNumber = mobileNumber;

        if (updates.email) {
            const existingEmail = await Student.findOne({
                email: updates.email,
                _id: { $ne: req.user.id }
            });

            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    message: "Email already exists"
                });
            }
        }

        const admin = await Student.findOneAndUpdate(
            { _id: req.user.id, role: "admin" },
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password -otp -otpExpires");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Admin profile updated successfully",
            admin
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Profile update failed",
            error: error.message
        });
    }
};


// CHANGE ADMIN PASSWORD
const changeAdminPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required"
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const admin = await Student.findOne({
            _id: req.user.id,
            role: "admin"
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            admin.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        admin.password = await bcrypt.hash(newPassword, 10);
        await admin.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Password change failed",
            error: error.message
        });
    }
};


// UPDATE NOTIFICATION SETTINGS
const updateNotifications = async (req, res) => {
    try {
        const {
            emailNotifications,
            orderNotifications,
            paymentNotifications,
            stockAlerts
        } = req.body;

        const updates = {};

        const fields = {
            emailNotifications,
            orderNotifications,
            paymentNotifications,
            stockAlerts
        };

        for (const [key, value] of Object.entries(fields)) {
            if (value !== undefined) {
                if (typeof value !== "boolean") {
                    return res.status(400).json({
                        success: false,
                        message: `${key} must be true or false`
                    });
                }

                updates[`notificationSettings.${key}`] = value;
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No notification settings provided"
            });
        }

        const admin = await Student.findOneAndUpdate(
            { _id: req.user.id, role: "admin" },
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password -otp -otpExpires");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification settings updated",
            notificationSettings: admin.notificationSettings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Notification update failed",
            error: error.message
        });
    }
};


// ENABLE / DISABLE TWO FACTOR AUTHENTICATION
const updateTwoFactor = async (req, res) => {
    try {
        const { enabled } = req.body;

        if (typeof enabled !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Enabled must be true or false"
            });
        }

        const admin = await Student.findOneAndUpdate(
            { _id: req.user.id, role: "admin" },
            { $set: { twoFactorEnabled: enabled } },
            { new: true }
        ).select("-password -otp -otpExpires");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            message: enabled
                ? "Two-factor authentication enabled"
                : "Two-factor authentication disabled",
            twoFactorEnabled: admin.twoFactorEnabled
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Security settings update failed",
            error: error.message
        });
    }
};


module.exports = {
    getAdminSettings,
    updateAdminProfile,
    changeAdminPassword,
    updateNotifications,
    updateTwoFactor
};
