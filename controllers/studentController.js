const Student = require("../models/studentModel");

const getIndex = (req, res) => {
    res.json({
        message: "Index route working"
    });
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
            req.params.id,
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
        const student = await Student.findByIdAndDelete(req.params.id);

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