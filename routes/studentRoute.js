const express = require("express")
const router = express.Router()
router.get("/students", (req, res) => {
    res.json({
        message: "Students data"
    });
});

router.post('/students',(req,res)=>{
    res.json({
        message:"students data is created"
    })
})

router.put("/students/:id", (req, res) => {
    res.json({
        message: "Student updated successfully"
    });
});

module.exports = router;