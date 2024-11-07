const express = require("express");

const router = express.Router();

const {login,signup} = require("../Controllers/Auth");
const {auth, isStudent, isAdmin} = require("../middlewares/auth");

router.post("/login",login);
router.post("/signup",signup);


//creating a testing route
router.get("/test", auth,(req,res) => {
    res.json({
        success: true,
        message: "Welcome to the testing route"
    });
})

//Protected Routes

router.get("/student", auth, isStudent, (req,res) => { 
    res.json({
        success: true,
        message: "Welcome to the Protected route for the student account"
    });
} )


router.get("/admin", auth, isAdmin, (req,res) => {
    res.json({
        success: true,
        message: "Welcome to the Protected route for the admin account"
    });
})


module.exports = router;