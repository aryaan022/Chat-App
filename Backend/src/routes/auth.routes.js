const express = require("express");
const { signup,login,logout,updateProfile} = require("../controllers/auth.controllers.js");
const router = express.Router();



router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", updateProfile);

module.exports = router;