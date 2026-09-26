const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

    name: String,

    email: String,

    password: String,

    mobileNumber: String,

    role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  }
});

 

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;