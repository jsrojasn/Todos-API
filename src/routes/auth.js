const express = require("express");
const AuthController = require("../controllers/auth.js")


const router = express.Router();

router.post("/signup", AuthController.signup);

router.post("/signin", AuthController.signin);

module.exports = router;