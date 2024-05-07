const express = require("express");

const authcontroller = require("../controller/auth");


const router = express.Router();

//signup 
router.post("/signup", authcontroller.postSignUp);



//login
router.post("/login",authcontroller.postLogin);

module.exports = router;