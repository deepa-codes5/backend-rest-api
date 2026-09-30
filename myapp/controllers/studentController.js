const Student = require("../models/studentModel");

   const getIndex = async (req, res) => {
    try {
        const students = await Student.findById(req.user.id);

        res.status(200).json({
            students: students
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch students",
            error: error.message
        });
    }
};


const createStudent = async (req, res) => {

    try {
        const student = await Student.create(req.body);

        res.status(201).json({
            message: "Student created successfully",
            student: student
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Student creation failed",
            error: error.message
        });

    }
};

const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.user.id,
            req.body,
            { new: true }
        );

        res.json({
            message: "Student updated successfully",
            student: student
        });

    } catch (error) {
        res.status(500).json({
            message: "Student update failed",
            error: error.message
        });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.user.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student deleted successfully", student });
    } catch (error) {
        res.status(500).json({ message: "Error deleting student", error: error.message });
    }
};

module.exports = {
    getIndex,
    createStudent,
    updateStudent,
    deleteStudent
};