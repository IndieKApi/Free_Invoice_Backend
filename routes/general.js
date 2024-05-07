const express = require("express");
const isauth = require("../middleware/check-auth");


const generalController = require("../controller/general");
const router = express.Router();

router.get("/",isauth,generalController.GetHomePage);

module.exports = router;